import React, { createContext } from "react";
import { doctors } from "../assets/assets_frontend/assets";
type Address = {
  line1: string;
  line2: string;
};

export type Doctor = {
  _id: string;
  name: string;
  image: string;
  speciality: string;
  degree: string;
  experience: string;
  about: string;
  fees: number;
  address: Address;
};
export const AppContext = createContext<Doctor[]>([]);

const AppContextProvider = (props: { children: React.ReactNode }) => {
  const value: Doctor[] = doctors;
  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};
export default AppContextProvider;
