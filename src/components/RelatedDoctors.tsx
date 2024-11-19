import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDoctors } from "../zustand/store";
import Loader from "./Loader";
type RelatedDoctorsProps = {
  docId: string;
  speciality: string;
};
const RelatedDoctors: React.FC<RelatedDoctorsProps> = ({
  docId,
  speciality,
}) => {
  const { related_doctors, loading, getRelatedDoctors } = useDoctors();
  useEffect(() => {
    getRelatedDoctors(docId, speciality);
  }, [docId, getRelatedDoctors, speciality]);
  const navigate = useNavigate();
  console.log("docId Speciality", docId, speciality);
  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-10">
          <h1 className="text-3xl font-medium">Suggested Doctors to Book</h1>
          <p className="sm:w-1/3 text-center text-sm">
            Simply browse through our extensive list of trusted doctors.
          </p>
          {related_doctors.length > 0 ? (
            <>
              {" "}
              <div className="w-full grid grid-cols-auto gap-4 pt-5 gap-y-6 px-3 sm:px-0">
                {related_doctors.slice(0, 5).map((item, index) => (
                  <div
                    onClick={() => {
                      navigate(`/appointment/${item._id}/${item.speciality}`);
                      scrollTo(0, 0);
                    }}
                    key={index}
                    className="border border-green-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500"
                  >
                    <img
                      className="bg-green-50 h-72 sm:h-80 w-full object-cover"
                      src={item.image}
                      alt={item.name}
                    />
                    <div className="p-4">
                      <div className="flex items-center gap-2 text-sm text-center text-primary">
                        <p className="w-2 h-2 rounded-full bg-primary"></p>
                        <p>Available</p>
                      </div>
                      <p className="text-lg text-gray-900 font-medium">
                        {item.name}
                      </p>
                      <p className="text-gray-600 text-sm ">
                        {item.speciality}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => {
                  navigate("/doctors");
                  scrollTo(0, 0);
                }}
                className="bg-green-50 text-gray-600 px-12 py-3 rounded-full mt-10"
              >
                more
              </button>
            </>
          ) : (
            <p>No related doctors yet for this speciality</p>
          )}
        </div>
      )}
    </>
  );
};

export default RelatedDoctors;
