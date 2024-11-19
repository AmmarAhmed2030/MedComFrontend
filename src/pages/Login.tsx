import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useAuthUser } from "../zustand/store";
type FormValues = {
  email: string;
  password: string;
};
const Login = () => {
  const { loading, loginUser } = useAuthUser();
  const loginSchema = yup.object().shape({
    email: yup
      .string()
      .required("Email is required")
      .email("Invalid email address"),
    password: yup
      .string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters")
      .max(30, "Password maximum 30 characters"),
  });
  const navigate = useNavigate();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(loginSchema),
    mode: "onChange",
  });
  const onSubmitHandler = async (data: FormValues) => {
    await loginUser(data.email, data.password);
    navigate("/");
  };
  return (
    <form
      onSubmit={handleSubmit(onSubmitHandler)}
      className="min-h-[80vh] flex items-center"
    >
      <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shaow-lg">
        <p className="text-2xl font-semibold">Login</p>
        <p>Please log in to book appointment</p>

        <div className="w-full flex flex-col gap-3">
          <label htmlFor="email">Email</label>
          <input
            {...register("email")}
            className="border border-zinc-300 rounded w-full p-2 mt-1"
            id="email"
            type="email"
            required
          />
          {errors.email && (
            <small className="text-red-500">{errors.email.message}</small>
          )}
        </div>
        <div className="w-full flex flex-col gap-3">
          <label htmlFor="password">Password</label>
          <input
            className="border border-zinc-300 rounded w-full p-2 mt-1"
            id="password"
            {...register("password")}
            type="password"
            required
          />
          {errors.password && (
            <small className="text-red-500">{errors.password.message}</small>
          )}
        </div>
        <button className="bg-primary text-white w-full py-2 rounded-md text-base">
          {loading ? "Logging..." : "Login"}
        </button>

        <p>
          Create a new account?
          <span
            onClick={() => navigate("/register")}
            className="text-primary underline cursor-pointer"
          >
            register here
          </span>{" "}
        </p>
      </div>
    </form>
  );
};

export default Login;
