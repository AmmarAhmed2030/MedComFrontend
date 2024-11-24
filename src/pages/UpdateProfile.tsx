import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAuthUser } from "../zustand/store";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import { assets } from "../assets/assets_frontend/assets";

enum Gender {
  Male = "Male",
  Female = "Female",
}

type Address = {
  line1: string;
  line2?: string;
};

export type UpdateProfileForm = {
  image?: FileList;
  name: string;
  phone: string;
  address: Address;
  gender: Gender;
  dob: Date;
};

const updateProfileSchema = yup.object().shape({
  image: yup.mixed(),
  name: yup
    .string()
    .required("Full Name is required")
    .min(3, "Name must be at least 3 characters"),
  phone: yup
    .string()
    .matches(
      /^(\+?\d{1,4}|\d{1,4})?([ -]?\d{1,3}){3,5}$/,
      "Phone number is not valid"
    )
    .required("Phone number is required"),
  address: yup.object().shape({
    line1: yup.string().required("Address Line 1 is required"),
    line2: yup.string(),
  }),
  gender: yup
    .string()
    .oneOf(Object.values(Gender), "Gender is required")
    .required("Gender is required"),
  dob: yup.date().required("Date of birth is required"),
});

const UpdateProfile = () => {
  const navigate = useNavigate();
  const [docImg, setDocImg] = useState<File | null>(null);
  const [updateLoading, setUpdateLoading] = useState<boolean>(false);
  const { user, userToken, setUser, getProfile, loading } = useAuthUser();

  useEffect(() => {
    getProfile();
  }, [getProfile]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateProfileForm>({
    resolver: yupResolver(updateProfileSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: UpdateProfileForm) => {
    try {
      const formData = new FormData();

      formData.append("name", data.name);
      formData.append("phone", data.phone);
      formData.append("address", JSON.stringify(data.address));
      formData.append("gender", data.gender);
      formData.append("dob", data.dob.toISOString());

      if (docImg) {
        formData.append("image", docImg);
      }

      const backendURL = import.meta.env.VITE_BACKEND_URL;
      setUpdateLoading(true);
      const response = await axios.patch(
        `${backendURL}/api/user/update-profile`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      setUser({
        ...user,
        name: data.name,
        phone: data.phone,
        address: data.address,
        gender: data.gender,
        dob: data.dob.toISOString(),
        image: response.data.image || user?.image,
      });
      toast.success("Profile Updated successfully");
      setUpdateLoading(false);
      navigate("/my-profile");
    } catch (error: unknown) {
      setUpdateLoading(false);
      if (axios.isAxiosError(error)) {
        if (error.response) {
          const status = error.response.status;
          if (status === 400) {
            toast.error("Bad Request: " + error.response.data.message);
          } else if (status === 401) {
            toast.error("Unauthorized: Please check your authentication.");
          } else if (status === 500) {
            toast.error("Server Error: Please try again later.");
          } else {
            toast.error("Error: " + error.response.data.message);
          }
        } else if (error.request) {
          toast.error("No response from server. Please check your network.");
        } else {
          toast.error("Request Error: " + error.message);
        }
      } else if (error instanceof Error) {
        toast.error("An unexpected error occurred: " + error.message);
      } else {
        toast.error("An unknown error occurred.");
      }
    }
  };

  return loading ? (
    <Loader />
  ) : user ? (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-2xl flex flex-col gap-2 text-sm mx-auto"
    >
      <div className="flex items-center gap-4 mb-8 text-gray-500">
        <label htmlFor="doc-img">
          {!docImg && !user?.image ? (
            <img
              src={assets.upload_area}
              alt=""
              className="w-16 h-16 rounded-full cursor-pointer"
            />
          ) : (
            <img
              src={docImg ? URL.createObjectURL(docImg) : user?.image}
              alt=""
              className="w-16 h-16 rounded-full cursor-pointer"
            />
          )}
        </label>
        <input
          type="file"
          id="doc-img"
          hidden
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) setDocImg(file);
          }}
        />
        <p>
          Upload profile
          <br />
          picture
        </p>
      </div>

      <input
        className="border border-zinc-300 rounded w-full p-2 mt-4"
        type="text"
        defaultValue={user?.name}
        {...register("name")}
      />
      {errors.name && (
        <small className="text-red-500">{errors.name.message}</small>
      )}

      <hr className="bg-zinc-400 border-none h-[1px]" />

      <div>
        <p className="text-neutral-500 underline mt-3">CONTACT INFORMATION</p>
        <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700">
          <p className="font-medium">Phone:</p>
          <div className="flex flex-col">
            <input
              className="border border-zinc-300 rounded w-full p-2 mt-4"
              type="text"
              defaultValue={user?.phone}
              {...register("phone")}
            />
            {errors.phone && (
              <small className="text-red-500 block">
                {errors.phone.message}
              </small>
            )}
          </div>
          <p className="font-medium">Address:</p>
          <div className="flex flex-col">
            <input
              className="border border-zinc-300 rounded w-full p-2 mt-4"
              type="text"
              defaultValue={user?.address?.line1 || ""}
              {...register("address.line1")}
            />
            {errors.address?.line1 && (
              <small className="text-red-500 block">
                {errors.address.line1.message}
              </small>
            )}

            <input
              className="border border-zinc-300 rounded w-full p-2 mt-4"
              type="text"
              defaultValue={user?.address?.line2 || ""}
              {...register("address.line2")}
            />
          </div>
        </div>
      </div>

      <hr className="bg-zinc-400 border-none h-[1px]" />

      <div className="flex flex-col">
        <p className="text-neutral-500 underline mt-3">BASIC INFORMATION</p>
        <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700">
          <p className="font-medium">Gender:</p>
          <div>
            <select
              className="border border-zinc-300 rounded w-full p-2 mt-4"
              defaultValue={user?.gender}
              {...register("gender")}
            >
              <option value={Gender.Male}>Male</option>
              <option value={Gender.Female}>Female</option>
            </select>
            {errors.gender && (
              <p className="text-red-500 block">{errors.gender.message}</p>
            )}
          </div>
          <p className="font-medium">Birthday:</p>
          <input
            className="border border-zinc-300 rounded w-full p-2 mt-4"
            type="date"
            defaultValue={user?.dob ? user.dob.toString().substring(0, 10) : ""}
            {...register("dob")}
          />
          {errors.dob && (
            <p className="text-red-500 block">{errors.dob.message}</p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-end">
        <button
          type="submit"
          className="py-2 px-6 bg-green-500 text-white rounded-full mt-8"
        >
          {updateLoading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  ) : (
    <p>Loading user data...</p>
  );
};

export default UpdateProfile;
