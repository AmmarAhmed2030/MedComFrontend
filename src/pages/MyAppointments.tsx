import { useEffect, useState } from "react";
import { Address, useAuthUser, useDoctors, User } from "../zustand/store";
import axios from "axios";
import Loader from "../components/Loader";
import { toast } from "react-toastify";
import { loadStripe, Stripe } from "@stripe/stripe-js";
const stripePromise = loadStripe(
  "pk_test_51QMuEqAkzMjXBuh6owbIqBnPpSPnt8X1qIb9CxIZdKanma7NZtZ7HEN1sdD2KECZbGc6MB0DJjkROI3ttMGMV2pX00RTvFaS9D"
); // Replace with your publishable key
type DoctorData = {
  _id: string;
  name: string;
  image: string;
  speciality: string;
  degree: string;
  experience: string;
  about: string;
  fees: number;
  address: Address;
  date: number;
  available: boolean;
};
type Appointment = {
  _id: string;
  userId: string;
  docId: string;
  slotDate: string;
  slotTime: string;
  userData: User;
  docData: DoctorData;
  amount: number;
  date: number;
  cancelled: boolean;
  payment: boolean;
  isCompleted: boolean;
};
const MyAppointments = () => {
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const { userToken } = useAuthUser();
  const [loading, setLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const { getDoctorById } = useDoctors();
  const [appointments, setAppointments] = useState<Appointment[] | null>([]);
  const months = [
    "",
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const slotDateFormat = (slotDate: string) => {
    const dateArray = slotDate.split("_");
    return (
      dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2]
    );
  };
  const getAppointments = async (
    userToken: string | null,
    backendURL: string
  ) => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        `${backendURL}/api/user/get-my-appointments`,
        {},
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      if (data) {
        setLoading(false);
        setAppointments(data.data.reverse());
      }
    } catch (error: unknown) {
      setLoading(false);
      if (axios.isAxiosError(error)) {
        // Axios-specific error handling
        if (error.response) {
          toast.dismiss();
          toast.error("Error: " + error.response.data.message);
        } else {
          toast.dismiss();
          toast.error(error.message);
        }
      } else {
        // Fallback for unexpected error types
        toast.dismiss();
        toast.error("An unexpected error occurred");
      }
    }
  };
  const cancelAppointment = async (
    userToken: string | null,
    backendURL: string,
    appointmentId: string | null,
    docId: string
  ) => {
    try {
      setCancelLoading(true);
      const { data } = await axios.post(
        `${backendURL}/api/user/cancel-appointment/${appointmentId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      if (data.status === "success") {
        setCancelLoading(false);
        toast.success("appointment cancelled successfully");
        getAppointments(userToken, backendURL);
        getDoctorById(docId);
      }
    } catch (error: unknown) {
      setCancelLoading(false);
      if (axios.isAxiosError(error)) {
        // Axios-specific error handling
        if (error.response) {
          toast.dismiss();
          toast.error("Error: " + error.response.data.message);
        } else {
          toast.dismiss();
          toast.error(error.message);
        }
      } else {
        // Fallback for unexpected error types
        toast.dismiss();
        toast.error("An unexpected error occurred");
      }
    }
  };
  const handleCheckout = async (appointmentId: string) => {
    try {
      const stripe: Stripe | null = await stripePromise;

      const backenUrl = import.meta.env.VITE_BACKEND_URL;
      // Call your backend to create the Checkout session
      const response = await axios.get(
        `${backenUrl}/api/user/checkout-session/${appointmentId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
        }
      );

      const { session } = response.data;

      // Redirect to Stripe Checkout
      const result = await stripe?.redirectToCheckout({
        sessionId: session.id,
      });

      if (result?.error) {
        console.error(result.error.message);
        toast.error(result.error.message);
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        // Axios-specific error handling
        if (error.response) {
          toast.dismiss();
          toast.error("Error: " + error.response.data.message);
        } else {
          toast.dismiss();
          toast.error(error.message);
        }
      } else {
        // Fallback for unexpected error types
        toast.dismiss();
        toast.error("An unexpected error occurred");
      }
    }
  };
  useEffect(() => {
    getAppointments(userToken, backendURL);
  }, [backendURL, userToken]);

  return loading ? (
    <Loader />
  ) : (
    <div>
      <p className="pb-3 mt-12 font-medium text-zinc-700 border-b">
        My Appointments
      </p>
      <div>
        {appointments?.slice(0, 3).map((item, index) => (
          <div
            className="grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b"
            key={index}
          >
            <div>
              <img
                className="w-32 bg-indigo-50"
                src={item.docData.image}
                alt=""
              />
            </div>
            <div className="flex-1 text-sm text-zinc-600">
              <p className="text-neutral-800 font-semibold">
                {item.docData.name}
              </p>
              <p>{item.docData.speciality}</p>
              <p className="text-zinc-700 font-medium mt-1">Address:</p>
              <p className="text-xs">{item.docData.address.line1}</p>
              <p className="text-xs">{item.docData.address.line2}</p>
              <p className="text-xs mt-1">
                <span className="text-sm text-neutral-700 font-medium">
                  Date & Time:
                </span>
                {slotDateFormat(item.slotDate)} | {item.slotTime}
              </p>
            </div>
            <div></div>
            <div className="flex flex-col justify-center items-center gap-2">
              {item.cancelled ? null : item.payment ? (
                <p>Paid</p>
              ) : (
                <button
                  onClick={() => handleCheckout(item._id)}
                  className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-primary hover:text-white transition-all duration-300"
                >
                  Pay Online
                </button>
              )}
              {item.cancelled ? (
                <button
                  onClick={() =>
                    cancelAppointment(
                      userToken,
                      backendURL,
                      item._id,
                      item.docId
                    )
                  }
                  className="text-sm text-red-600 text-center sm:min-w-48 py-2 border rounded  border-red-600  "
                >
                  Appointment Cancelled
                </button>
              ) : (
                <button
                  onClick={() =>
                    cancelAppointment(
                      userToken,
                      backendURL,
                      item._id,
                      item.docId
                    )
                  }
                  className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-red-600 hover:text-white transition-all duration-300"
                >
                  {cancelLoading
                    ? "Cancelling Appointment"
                    : "Cancel appointment"}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyAppointments;
