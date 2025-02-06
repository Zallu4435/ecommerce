import { adminLoginSchema } from "../../validation/admin/loginFormValidation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useLoginAdminMutation } from "../../redux/apiSliceFeatures/AdminApiSlice";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setAdminCredentials } from "../../redux/slice/adminSlice";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [loginAdmin] = useLoginAdminMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(adminLoginSchema),
  });

  const onSubmit = async (data) => {
    try {
      const response = await loginAdmin(data).unwrap();
      dispatch(setAdminCredentials(response.admin, response.adminAccessToken));
      navigate("/admin/dashboard");
    } catch (err) {
      toast.error(err?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen dark:bg-gray-900 flex bg-orange-50 items-center justify-center p-4">
      <div className="dark:bg-gray-800 bg-orange-100 p-8 rounded-lg shadow-xl w-full sm:max-w-md md:max-w-lg lg:max-w-xl">
        <h2 className="text-3xl text-center text-gray-600 font-bold dark:text-white mb-8">
          Admin Login
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} method="POST">
          <div className="mb-6">
            <input
              type="email"
              placeholder="Enter your email"
              {...register("email")}
              className={`w-full p-4 border ${
                errors.email ? "border-red-500" : "border-gray-600"
              } rounded-md dark:bg-gray-700 text-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 text-lg`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="mb-6">
            <input
              type="password"
              placeholder="Enter your password"
              {...register("password")}
              className={`w-full p-4 border ${
                errors.password ? "border-red-500" : "border-gray-600"
              } rounded-md dark:bg-gray-700 dark:text-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 text-lg`}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 font-bold dark:bg-blue-600 bg-orange-500 text-white rounded-md dark:hover:bg-blue-700 hover:bg-orange-600 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
