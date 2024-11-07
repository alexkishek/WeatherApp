import { useState } from "react";
import apiClient from "../config/axios";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";
import {toastError, toastSuccess} from "../utils/toastHelper";

async function createUser(data) {
  try {
    return await apiClient.post(`/user`, data);
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      const errorMessage = error.response.data.message;
      toastError(errorMessage);
    }
    throw error;
  }
}

function CreateAccount() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    };

    if (!formData.firstName) {
      newErrors.firstName = "First name is required";
      toastError(newErrors.firstName);
    }
    if (!formData.lastName) {
      newErrors.lastName = "Last name is required";
      toastError(newErrors.lastName);
    }
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
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      toastError(newErrors.password);
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      toastError(newErrors.confirmPassword);
    }

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => error === "");
  };

  const handleCreateAccount = async () => {
    if (!validateForm()) {
      toastError("Form validation failed.");
      return;
    }

    try {
      await createUser({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      });

      const response = await loginUser({
        email: formData.email,
        password: formData.password,
      });

      localStorage.setItem("accessToken", response.accessToken);
      toastSuccess("Account created successfully!");
      navigate("/");
    } catch (error) {
      throw error;
    }
  };

  return (
    <div className={"bg-base-200"}>
      <div className={"flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0"}>
        <div className={"w-full bg-base-100 rounded-lg shadow-md md:mt-0 sm:max-w-md xl:p-0"}>
          <div className={"p-6 space-y-4 md:space-y-6 sm:p-8"}>
            <h1 className={"text-xl font-bold leading-tight tracking-tight md:text-2xl"}>
              Create an account
            </h1>
            <div className={"space-y-4 md:space-y-6"}>
              <div className={"flex flex-row space-x-4"}>
                <div>
                  <label htmlFor="firstName" className={"block mb-2 text-sm font-medium"}>
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    id="firstName"
                    className={"input input-bordered w-full"}
                    placeholder="John"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                  />
                  {errors.firstName && <p className="text-red-500 text-sm mt-2">{errors.firstName}</p>}
                </div>
                <div>
                  <label htmlFor="lastName" className={"block mb-2 text-sm font-medium"}>
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    id="lastName"
                    className={"input input-bordered w-full"}
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                  />
                  {errors.lastName && <p className="text-red-500 text-sm mt-2">{errors.lastName}</p>}
                </div>
              </div>
              <div>
                <label htmlFor="email" className={"block mb-2 text-sm font-medium"}>
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className={"input input-bordered w-full"}
                  placeholder="name@company.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
                {errors.email && <p className="text-red-500 text-sm mt-2">{errors.email}</p>}
              </div>
              <div>
                <label htmlFor="password" className={"block mb-2 text-sm font-medium"}>
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  className={"input input-bordered w-full"}
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
                {errors.password && <p className="text-red-500 text-sm mt-2">{errors.password}</p>}
              </div>
              <div>
                <label htmlFor="confirmPassword" className={"block mb-2 text-sm font-medium"}>
                  Confirm password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  id="confirmPassword"
                  placeholder="••••••••"
                  className={"input input-bordered w-full"}
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                />
                {errors.confirmPassword && <p className="text-red-500 text-sm mt-2">{errors.confirmPassword}</p>}
              </div>
              <button
                type="button"
                className={"btn btn-primary w-full"}
                onClick={handleCreateAccount}
              >
                Create an account
              </button>
              <p className={"text-sm font-light"}>
                Already have an account?{' '}
                <a href="/login" className={"link link-primary hover:underline"}>
                  Login here
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateAccount;
