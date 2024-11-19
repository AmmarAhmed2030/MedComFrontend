import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import Doctors from "./pages/Doctors";
import Login from "./pages/Login";
import About from "./pages/About";
import Contact from "./pages/Contact";
import MyProfile from "./pages/MyProfile";
import MyAppointments from "./pages/MyAppointments";
import Appointment from "./pages/Appointment";
import ProtectedLayout from "./ProtectedLayout";
import Register from "./pages/Register";
import UpdateProfile from "./pages/UpdateProfile";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion, useScroll, useSpring } from "framer-motion";
import "./index.css";

const router = createBrowserRouter([
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: <ProtectedLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "doctors",
        element: <Doctors />,
      },
      {
        path: "doctors/:speciality",
        element: <Doctors />,
      },

      {
        path: "about",
        element: <About />,
      },
      {
        path: "contact",
        element: <Contact />,
      },
      {
        path: "my-profile",
        element: <MyProfile />,
      },
      {
        path: "update-profile",
        element: <UpdateProfile />,
      },
      {
        path: "my-appointments",
        element: <MyAppointments />,
      },
      {
        path: "appointment/:docId/:speciality",
        element: <Appointment />,
      },
    ],
  },
]);
const App = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });
  return (
    <>
      <motion.div className="progress-bar" style={{ scaleX }} />
      <div className="mx-4 sm:mx-[10%]">
        <ToastContainer />
        <RouterProvider router={router} />
      </div>
    </>
  );
};

export default App;
