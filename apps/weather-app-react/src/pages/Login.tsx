import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";
import {toastError, toastSuccess} from "../utils/toastHelper";

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = { email: '', password: '' };

    if (!formData.email) {
      newErrors.email = "Email is required";
      toastError(newErrors.email);
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email address is invalid";
      toastError(newErrors.email);
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
      toastError(newErrors.password);
    }

    setErrors(newErrors);
    return !newErrors.email && !newErrors.password;
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const response = await loginUser(formData);
      const token = response.accessToken;

      localStorage.setItem("accessToken", token);

      setFormData({
        email: '',
        password: '',
      });

      navigate("/");
    } catch (error) {
      toastError("Incorrect email or password")
    }
  };

  return (
    <div className="bg-base-200">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-base-100 rounded-lg shadow-md md:mt-0 sm:max-w-md xl:p-0">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight md:text-2xl">
              Sign in
            </h1>
            <div className="space-y-4 md:space-y-6">
              <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="input input-bordered w-full"
                  placeholder="name@company.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
                {errors.email && <p className="text-red-500 text-sm mt-2">{errors.email}</p>}
              </div>
              <div>
                <label htmlFor="password" className="block mb-2 text-sm font-medium">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  className="input input-bordered w-full"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
                {errors.password && <p className="text-red-500 text-sm mt-2">{errors.password}</p>}
              </div>
              <button
                type="submit"
                className="btn btn-primary w-full"
                onClick={handleLogin}
              >
                Login
              </button>
              <p className="text-sm font-light">
                Don't have an account?{' '}
                <a href="/register" className="link link-primary hover:underline">
                  Create one here
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
