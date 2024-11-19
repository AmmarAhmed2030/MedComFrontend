import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Doctor, useDoctors } from "../zustand/store";
import Loader from "../components/Loader";

const Doctors = () => {
  const { speciality = " " } = useParams();
  const [showFilter, setShowFilter] = useState(true);
  const navigate = useNavigate();
  const { doctors_speciality, getDoctorsBySpeciality, loading } = useDoctors();

  useEffect(() => {
    getDoctorsBySpeciality(speciality); // Fetch data on component mount
  }, [getDoctorsBySpeciality, speciality]);

  return (
    <div>
      <p className="text-gray-600">Browse through the doctors specialist.</p>
      <div className="flex flex-col sm:flex-row items-start gap-5 mt-5">
        <button
          className={`py-1 px-3 border rounded text-sm transition-all sm:hidden ${
            showFilter ? "bg-primary text-white" : ""
          }`}
          onClick={() => setShowFilter((prev) => !prev)}
        >
          Filters
        </button>
        <div
          className={`flex-col gap-4 text-sm text-gray-600 ${
            showFilter ? "flex" : "hidden sm:flex"
          }`}
        >
          <p
            onClick={() =>
              speciality === "General physician"
                ? navigate("/doctors")
                : navigate("/doctors/General physician")
            }
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${
              speciality === "General physician"
                ? "bg-indigo-100 text-black"
                : ""
            }`}
          >
            General physician
          </p>
          <p
            onClick={() =>
              speciality === "Gynecologist"
                ? navigate("/doctors")
                : navigate("/doctors/Gynecologist")
            }
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${
              speciality === "Gynecologist" ? "bg-indigo-100 text-black" : ""
            }`}
          >
            Gynecologist
          </p>
          <p
            onClick={() =>
              speciality === "Dermatologist"
                ? navigate("/doctors")
                : navigate("/doctors/Dermatologist")
            }
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${
              speciality === "Dermatologist" ? "bg-indigo-100 text-black" : ""
            }`}
          >
            Dermatologist
          </p>
          <p
            onClick={() =>
              speciality === "Pediatricians"
                ? navigate("/doctors")
                : navigate("/doctors/Pediatricians")
            }
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${
              speciality === "Pediatricians" ? "bg-indigo-100 text-black" : ""
            }`}
          >
            Pediatricians
          </p>
          <p
            onClick={() =>
              speciality === "Neurologist"
                ? navigate("/doctors")
                : navigate("/doctors/Neurologist")
            }
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${
              speciality === "Neurologist" ? "bg-indigo-100 text-black" : ""
            }`}
          >
            Neurologist
          </p>
          <p
            onClick={() =>
              speciality === "Gastroenterologist"
                ? navigate("/doctors")
                : navigate("/doctors/Gastroenterologist")
            }
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${
              speciality === "Gastroenterologist"
                ? "bg-indigo-100 text-black"
                : ""
            }`}
          >
            Gastroenterologist
          </p>
        </div>
        {loading ? (
          <Loader />
        ) : (
          <div
            className={`${
              doctors_speciality.length > 0
                ? "grid grid-cols-auto gap-4 gap-y-6"
                : "flex justify-center items-center"
            } w-full `}
          >
            {doctors_speciality && doctors_speciality.length > 0 ? (
              doctors_speciality.map((item: Doctor, index: number) => (
                <div
                  onClick={() =>
                    navigate(`/appointment/${item._id}/${item.speciality}`)
                  }
                  key={index}
                  className="border border-green-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500"
                >
                  <img
                    className="bg-green-50 h-72 sm:h-80 w-full object-cover"
                    src={item.image}
                    alt={item.name}
                  />
                  <div className="p-4">
                    <div
                      className={`flex items-center gap-2 text-sm text-center  ${
                        item.available ? "text-primary" : "text-yellow-500"
                      }`}
                    >
                      <p
                        className={`w-2 h-2 rounded-full bg-primary ${
                          item.available ? "bg-primary" : "bg-yellow-500"
                        }`}
                      ></p>
                      <p>{item.available ? "Available" : "Not Available"}</p>
                    </div>
                    <p className="text-lg text-gray-900 font-medium">
                      {item.name}
                    </p>
                    <p className="text-gray-600 text-sm ">{item.speciality}</p>
                  </div>
                </div>
              ))
            ) : (
              <p>No Doctors yet for this speciality</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Doctors;
