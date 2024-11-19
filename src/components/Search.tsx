import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Select, { SingleValue, StylesConfig } from "react-select"; // Import StylesConfig type for Select
import { useDoctors } from "../zustand/store";

type Option = {
  value: string;
  label: string;
  speciality: string;
};

const customStyles: StylesConfig<Option, false> = {
  control: (provided, state) => ({
    ...provided,
    padding: "0.5rem", // Tailwind's equivalent of `p-2`
    borderWidth: "2px", // Tailwind's `border-2`
    borderColor: state.isFocused ? "#007E85" : "#007E85", // `blue-500` on focus, `gray-300` otherwise
    borderRadius: "0.375rem", // Tailwind's `rounded-md`
    boxShadow: state.isFocused ? "0 0 0 2px #007E85" : "none", // Tailwind's `ring-2 ring-blue-500`
    "&:hover": {
      borderColor: "#007E85", // `blue-500`
    },
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isFocused ? "#007E85" : "white", // `blue-500` on hover
    color: state.isFocused ? "white" : "black",
    padding: "0.5rem 1rem", // Tailwind's `px-4 py-2`
    cursor: "pointer",
  }),
  placeholder: (provided) => ({
    ...provided,
    color: "#9ca3af", // Tailwind's `text-gray-400`
    fontSize: "0.875rem", // Tailwind's `text-sm`
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "#374151", // Tailwind's `text-gray-700`
    fontSize: "1rem", // Tailwind's `text-base`
  }),
  menu: (provided) => ({
    ...provided,
    backgroundColor: "white",
    border: "1px solid #d1d5db", // Tailwind's `border-gray-300`
    borderRadius: "0.375rem", // Tailwind's `rounded-md`
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // Tailwind's shadow
  }),
};

const Search: React.FC = () => {
  const navigate = useNavigate();
  const { doctors, getAllDoctors } = useDoctors();
  const [options, setOptions] = useState<Option[]>([]);

  useEffect(() => {
    getAllDoctors();
  }, [getAllDoctors]);

  useEffect(() => {
    const doctorOptions = doctors.map((doctor) => ({
      value: doctor._id,
      label: `${doctor.name} - ${doctor.speciality}`,
      speciality: doctor.speciality,
    }));
    setOptions(doctorOptions);
  }, [doctors]);

  const handleSelectChange = (selectedOption: SingleValue<Option>) => {
    if (selectedOption) {
      // Navigate to the selected doctor's details or appointment page
      navigate(
        `/appointment/${selectedOption.value}/${selectedOption.speciality}`
      );
    }
  };

  return (
    <div className="border rounded-xl bg-white py-6 px-12 shadow-lg">
      <h1 className="capitalize text-4xl py-4">Find a Doctor</h1>
      <Select
        options={options}
        placeholder="Search by name..."
        isClearable
        isSearchable
        onChange={handleSelectChange} // Pass the updated handler
        styles={customStyles}
      />
    </div>
  );
};

export default Search;
