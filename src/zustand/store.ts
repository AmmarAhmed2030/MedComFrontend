import { create } from "zustand";
import axios from "axios";
import { toast } from "react-toastify";
export type Address = {
  line1: string;
  line2?: string;
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
  date: number;
  available: boolean;
  slots_booked: Record<string, string[]>; // Updated this line
};
export type User = {
  name: string;
  email?: string;
  image: string;
  address: Address;
  gender: string;
  dob: string;
  phone: string;
};

interface DoctorsState {
  doctors: Doctor[];
  related_doctors: Doctor[];
  doctors_speciality: Doctor[];

  loading: boolean;
  loadingSearchedDoctors: boolean;
  error: string | null;
  doctor: Doctor | null;
  searched_doctors: Doctor[];
  searchDoctors: (
    name: string,
    speciality: string,
    available: boolean
  ) => Promise<void>;
  getAllDoctors: () => Promise<void>;
  getDoctorById: (id: string) => Promise<void>;
  getRelatedDoctors: (id: string, speciality: string) => Promise<void>;
  getDoctorsBySpeciality: (speciality: string) => Promise<void>;
}
interface UserState {
  loading: boolean;
  user: User | null;
  userToken: string | null;
  loginUser: (email: string, password: string) => Promise<void>;
  logout: () => void;
  getProfile: () => Promise<void>;
  setUser: (user: User) => void;
}

const backendURL = import.meta.env.VITE_BACKEND_URL;

export const useDoctors = create<DoctorsState>((set) => ({
  loading: false,
  loadingSearchedDoctors: false,
  error: null,
  doctors: [],
  related_doctors: [],
  doctors_speciality: [],
  searched_doctors: [],
  doctor: null,
  searchDoctors: async (name, speciality, available) => {
    try {
      set({ loadingSearchedDoctors: true });

      const response = await axios.get(
        `${backendURL}/api/doctor/search-doctors/${name}/${speciality}/${available}`,
        { withCredentials: true }
      );
      if (response && response.data) {
        const { data } = response.data;

        set({ searched_doctors: data, loadingSearchedDoctors: false });
      } else {
        set({ loadingSearchedDoctors: false });
        toast.dismiss();
        toast.error("Something went wrong");
      }
    } catch (error: unknown) {
      set({ loadingSearchedDoctors: false });

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
  },
  getDoctorById: async (id) => {
    try {
      set({ loading: true });

      const response = await axios.get(
        `${backendURL}/api/doctor/get-Doctor/${id}`,
        { withCredentials: true }
      );
      if (response && response.data) {
        const { data } = response.data;

        set({ doctor: data, loading: false });
      } else {
        set({ loading: false });
        toast.dismiss();
        toast.error("Something went wrong");
      }
    } catch (error: unknown) {
      set({ loading: false });

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
  },
  getAllDoctors: async () => {
    try {
      set({ loading: true });

      const response = await axios.get(`${backendURL}/api/doctor/get-doctors`, {
        withCredentials: true,
      });
      if (response && response.data) {
        const { data } = response.data;

        set({ doctors: data, loading: false });
      } else {
        set({ loading: false });
        toast.dismiss();
        toast.error("Something went wrong");
      }
    } catch (error: unknown) {
      set({ loading: false });

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
  },
  getRelatedDoctors: async (id, speciality) => {
    try {
      set({ loading: true });

      const response = await axios.get(
        `${backendURL}/api/doctor/get-doctors/${id}/${speciality}`,
        { withCredentials: true }
      );
      if (response && response.data) {
        const { data } = response.data;

        set({ related_doctors: data, loading: false });
      } else {
        set({ loading: false });
        toast.dismiss();
        toast.error("Something went wrong");
      }
    } catch (error: unknown) {
      set({ loading: false });

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
  },
  getDoctorsBySpeciality: async (speciality) => {
    try {
      set({ loading: true });

      const response = await axios.get(
        `${backendURL}/api/doctor/get-doctors/${speciality}`,
        { withCredentials: true }
      );
      if (response && response.data) {
        const { data } = response.data;

        set({ doctors_speciality: data, loading: false });
      } else {
        set({ loading: false });
        toast.dismiss();
        toast.error("Something went wrong");
      }
    } catch (error: unknown) {
      set({ loading: false });

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
  },
}));

export const useAuthUser = create<UserState>((set) => ({
  loading: false,
  user: JSON.parse(localStorage.getItem("user") || "null"), // Initialize user from localStorage if it exists
  userToken: localStorage.getItem("userToken") || null,
  setUser: (user) => set({ user }), // This updates the user state
  loginUser: async (email, password) => {
    try {
      set({ loading: true });
      const response = await axios.post(
        `${backendURL}/api/user/login`,
        {
          email,
          password,
        },
        { withCredentials: true }
      );
      if (response && response.data) {
        const { token, user } = response.data;
        set({ loading: false, userToken: token, user });
        localStorage.setItem("userToken", token);
        localStorage.setItem("user", JSON.stringify(user));
        toast.dismiss();
        toast.success("logged in successfully");
      }
    } catch (error: unknown) {
      set({ loading: false });
      console.log("login error", error);
      if (axios.isAxiosError(error)) {
        toast.dismiss();
        toast.error(
          "Login failed: " + (error.response?.data.message || error.message)
        );
      } else {
        toast.dismiss();
        toast.error("An unexpected error occurred");
      }
    }
  },
  logout: () => {
    set({ userToken: null, user: null });
    localStorage.removeItem("userToken");
    localStorage.removeItem("user");
  },
  getProfile: async () => {
    try {
      set({ loading: true });
      const response = await axios.post(
        `${backendURL}/api/user/get-profile`,
        {},
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      if (response && response.data) {
        const { data } = response.data;
        console.log(data);
        set({ loading: false, user: data });
      }
    } catch (error: unknown) {
      set({ loading: false });
      console.log("getting profile error", error);
      if (axios.isAxiosError(error)) {
        set({ user: null });
      } else {
        set({ user: null });
      }
    }
  },
}));
