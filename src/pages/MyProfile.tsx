import { assets } from "../assets/assets_frontend/assets";
import { useNavigate } from "react-router-dom";
import { useAuthUser } from "../zustand/store";
import { useEffect } from "react";

const MyProfile = () => {
  const navigate = useNavigate();
  const { user, getProfile } = useAuthUser();
  useEffect(() => {
    getProfile();
  }, [getProfile]);
  return (
    <div className="max-w-2xl flex flex-col gap-2 text-sm mx-auto">
      <img
        className="w-36 rounded"
        src={user?.image ? `${user?.image}` : `${assets.upload_area}`}
        alt=""
      />

      <p className="font-medium text-3xl text-neutral-800 mt-4">{user?.name}</p>

      <hr className="bg-zinc-400 border-none h-[1px]" />
      <div>
        <p className="text-neutral-500 underline mt-3">CONTANT INFORMATION</p>
        <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700">
          <p className="font-medium">Email id:</p>
          <p className="text-blue-500">{user?.email}</p>
          <p className="font-medium">Phone:</p>

          <p className="text-blue-400">{user?.phone ? user?.phone : "N/A"}</p>

          <p className="font-medium">Address:</p>

          <div>
            <p className="text-blue-400">
              {user?.address ? user?.address.line1 : "N/A"}
            </p>
            <p className="text-blue-400">
              {user?.address ? user?.address.line2 : "N/A"}
            </p>
          </div>
        </div>
      </div>
      <hr className="bg-zinc-400 border-none h-[1px]" />
      <div>
        <p className="text-neutral-500 underline mt-3">BASIC INFORMATION</p>
        <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700">
          <p className="font-medium">Gender:</p>

          <p className="text-blue-400">
            {user?.gender ? user?.gender : "Not selected"}
          </p>

          <p className="font-medium">Birthday:</p>

          <p className="text-blue-400">
            {user?.dob ? user?.dob.toString().substring(0, 10) : "Not Selected"}
          </p>
        </div>
      </div>
      <div className="flex justify-end">
        <button
          className="border border-primary px-8 py-2 rounded-full mt-4 hover:bg-primary hover:text-white transition-all"
          onClick={() => navigate("/update-profile")}
        >
          Edit
        </button>
      </div>
    </div>
  );
};

export default MyProfile;
