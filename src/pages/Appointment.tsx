import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { assets } from "../assets/assets_frontend/assets";
import RelatedDoctors from "../components/RelatedDoctors";
import { useAuthUser, useDoctors } from "../zustand/store";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import axios from "axios";
type TimeSlot = {
  datetime: Date;
  time: string;
};

const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const Appointment = () => {
  const { docId = "", speciality = "" } = useParams<{
    docId: string;
    speciality: string;
  }>();
  const [bookLoading, setLoading] = useState(false);
  const { doctor, loading, getDoctorById } = useDoctors();
  const { userToken } = useAuthUser();
  const [docSlots, setDocSlots] = useState<TimeSlot[][]>([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState("");
  const navigate = useNavigate();
  const backendURL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    getDoctorById(docId);
  }, [getDoctorById, docId]);
  useEffect(() => {
    const getAvailableSlots = async () => {
      setDocSlots([]);
      //getting current date
      const today = new Date();
      for (let i = 0; i < 7; i++) {
        //getting date with index
        const currentDate = new Date(today);
        currentDate.setDate(today.getDate() + i);
        //setting end time with index
        const endTime = new Date();
        endTime.setDate(today.getDate() + i);
        endTime.setHours(21, 0, 0, 0);

        //setting hours
        if (today.getDate() === currentDate.getDate()) {
          currentDate.setHours(
            currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10
          );
          currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
        } else {
          currentDate.setHours(10);
          currentDate.setMinutes(0);
        }
        const timeSlots: TimeSlot[] = [];
        while (currentDate < endTime) {
          const formattedTime = currentDate.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          });

          const day = currentDate.getDate();
          const month = currentDate.getMonth() + 1; // add slots to array
          const year = currentDate.getFullYear();
          const slotDate = day + "_" + month + "_" + year;
          const slotTime = formattedTime;
          const isSlotAvailable =
            doctor?.slots_booked[slotDate] &&
            doctor?.slots_booked[slotDate].includes(slotTime)
              ? false
              : true;

          if (isSlotAvailable) {
            timeSlots.push({
              datetime: new Date(currentDate),
              time: formattedTime,
            });
          }

          //increment time by 30 minute
          currentDate.setMinutes(currentDate.getMinutes() + 30);
        }
        setDocSlots((prev) => [...prev, timeSlots]);
      }
    };

    getAvailableSlots();
  }, [doctor?.slots_booked]);
  console.log(doctor?.slots_booked);
  const bookAppointment = async () => {
    if (!userToken) {
      toast.warn("Login to book Appointment");
      navigate("/login");
      return;
    }
    try {
      const date = docSlots[slotIndex][0].datetime;
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      const slotDate = day + "_" + month + "_" + year;
      console.log(slotDate);
      setLoading(true);
      const { data } = await axios.post(
        `${backendURL}/api/user/book-appointment`,
        { docId, slotDate, slotTime },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      if (data) {
        setLoading(false);
        toast.success(data.message);
        getDoctorById(docId);

        navigate("/my-appointments");
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

  return (
    <div>
      {/* Doctor Details */}
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="flex flex-col sm:flex-row gap-4">
            <div>
              <img
                src={doctor?.image}
                alt=""
                className="bg-primary w-full sm:max-w-72 rounded-lg"
              />
            </div>
            <div className="flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0">
              {/* docinfo name ,degree,experience */}
              <p className="flex items-center gap-2 text-2xl font-medium text-gray-900">
                {doctor?.name}
                <img className="w-5" src={assets.verified_icon} alt="" />
              </p>
              <div className="flex items-center gap-2 text-sm mt-1 text-gray-600">
                <p>
                  {doctor?.degree} - {doctor?.speciality}
                </p>
                <button className="py-0.5 px-2 border text-xs rounded-full">
                  {doctor?.experience}
                </button>
              </div>
              {/*  Doctor About */}
              <div>
                <p className="flex items-center gap-1 text-sm font-medium text-gray-900 mt-3">
                  About <img src={assets.info_icon} alt="" />
                </p>
                <p className="text-sm text-gray-500 max-w-[700px] mt-1">
                  {doctor?.about}
                </p>
              </div>
              <p className="text-gray-500 font-medium mt-4">
                Appointment fee: $
                <span className="text-gray-600">{doctor?.fees}</span>
              </p>
              <p className="text-gray-500 font-medium mt-4">
                Availability :
                <span
                  className={`text-gray-600 ${
                    doctor?.available ? "text-success" : "text-yellow-500"
                  }`}
                >
                  {doctor?.available ? " Available" : " Not Available"}
                </span>
              </p>
            </div>
          </div>
          {/* Booking slots  */}
          <div className="sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700">
            <p>Booking slots</p>
            <div className="flex gap-3 items-center w-full overflow-x-auto mt-">
              {docSlots.length > 0 &&
                docSlots.map(
                  (item, index) =>
                    item.length > 0 && (
                      <div
                        onClick={() => setSlotIndex(index)}
                        className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${
                          slotIndex === index
                            ? "bg-primary text-white"
                            : "border border-gray-200"
                        }`}
                        key={index}
                      >
                        <p>
                          {item[0] && daysOfWeek[item[0].datetime.getDay()]}
                        </p>
                        <p>{item[0] && item[0].datetime.getDate()}</p>
                      </div>
                    )
                )}
            </div>
            <div className="flex items-center gap-3 w-full overflow-x-scroll mt-4 scrollbar-hide">
              {docSlots.length &&
                docSlots[slotIndex].map((item, index) => (
                  <p
                    onClick={() => setSlotTime(item.time)}
                    key={index}
                    className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${
                      item.time === slotTime
                        ? "bg-primary text-white"
                        : "text-gray-400 border border-gray-300"
                    }`}
                  >
                    {item.time.toLowerCase()}
                  </p>
                ))}
            </div>
            <button
              onClick={bookAppointment}
              className="bg-primary text-white text-sm font-light px-14 py-3 rounded-full my-6"
            >
              {bookLoading
                ? "Booking an appointment..."
                : "Book an appointment"}
            </button>
          </div>
        </>
      )}
      {/* related doctors */}
      <RelatedDoctors docId={docId} speciality={speciality} />
    </div>
  );
};

export default Appointment;
