import { NavLink, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets_frontend/assets.ts";
import { useEffect, useState } from "react";
import { useAuthUser } from "../zustand/store.ts";
import { Link } from "react-router-dom";
const Navbar = () => {
  const navigate = useNavigate();
  const [showMenue, setShowMenue] = useState(false);
  const { logout, userToken, user, getProfile } = useAuthUser();
  const adminURL = import.meta.env.VITE_ADMIN_URL;
  useEffect(() => {
    getProfile();
  }, [getProfile]);
  return (
    <div className="flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-400">
      <div
        onClick={() => navigate("/")}
        className="flex items-center cursor-pointer"
      >
        <img src={assets.logo} alt="logo" className="w-16" />
        <span className="text-3xl font-semibold text-primary relative ">
          Med<span className="text-success">.com</span>
        </span>
      </div>
      <ul className="hidden md:flex items-start gap-5 font-medium">
        <NavLink to={"/"}>
          <li className="py-1">HOME</li>
          <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
        </NavLink>
        <NavLink to={"/doctors"}>
          <li className="py-1">ALL DOCTORS</li>
          <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
        </NavLink>
        <NavLink to={"/about"}>
          <li className="py-1">ABOUT</li>
          <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
        </NavLink>

        <NavLink to={"/contact"}>
          <li className="py-1">CONTACT</li>
          <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
        </NavLink>
      </ul>
      <div className="flex items-center gap-4">
        {userToken ? (
          <div className="flex items-center gap-2 cursor-pointer group relative">
            {user?.image ? (
              <img
                src={user?.image}
                alt="profile picture"
                className="w-8 h-8 rounded-full"
              />
            ) : (
              <p className="w-10 h-10 rounded-full bg-primary text-white text-center flex items-center justify-center text-xl font-medium">
                {user?.name[0].toUpperCase()}
              </p>
            )}

            <img
              src={assets.dropdown_icon}
              alt="dropdown icon"
              className="w-2.5"
            />
            <div className="absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block">
              <div className="min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4">
                <p
                  onClick={() => navigate("/my-profile")}
                  className="hover:text-black cursor-pointer"
                >
                  My Profile
                </p>
                <p
                  onClick={() => navigate("/update-profile")}
                  className="hover:text-black cursor-pointer"
                >
                  Edit Profile
                </p>
                <p
                  onClick={() => navigate("/my-appointments")}
                  className="hover:text-black cursor-pointer"
                >
                  My Appointments
                </p>
                <Link
                  to={`${adminURL}/login`}
                  className="hover:text-black cursor-pointer"
                >
                  Login Doctor
                </Link>
                <p
                  onClick={() => {
                    logout();
                    navigate("/login");
                  }}
                  className="hover:text-black cursor-pointer"
                >
                  Logout
                </p>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="bg-primary text-white px-8 py-3 rounded-full font-light hidden md:block"
          >
            Create account
          </button>
        )}
        <img
          onClick={() => setShowMenue(true)}
          className="w-6 md:hidden"
          src={assets.menu_icon}
          alt=""
        />
        {/* Mobil Menue */}
        <div
          className={` ${
            showMenue ? "fixed w-full" : "h-0 w-0"
          } md:hidden right-0 top-0 bottom-0 z-20 overflow-hidden bg-white transition-all`}
        >
          <div className="flex items-center justify-between px-5 py-6">
            <img src={assets.logo} alt="" className="w-36" />
            <img
              className="w-7"
              onClick={() => setShowMenue(false)}
              src={assets.cross_icon}
              alt=""
            />
          </div>
          <ul className="flex flex-col items-center gap-2 mt-5 px-5 text-lg font-medium">
            <NavLink to={"/"} onClick={() => setShowMenue(false)}>
              <p className="px-4 py-2 rounded inline-block">HOME</p>
            </NavLink>
            <NavLink to={"/doctors"} onClick={() => setShowMenue(false)}>
              <p className="px-4 py-2 rounded inline-block">ALL DOCTORS</p>
            </NavLink>
            <NavLink to={"/about"} onClick={() => setShowMenue(false)}>
              <p className="px-4 py-2 rounded inline-block">ABOUT</p>
            </NavLink>
            <NavLink to={"/contact"} onClick={() => setShowMenue(false)}>
              <p className="px-4 py-2 rounded inline-block">CONTACT</p>
            </NavLink>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
