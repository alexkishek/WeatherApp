import { useEffect, useState } from "react";
import {toastError, toastSuccess} from "../utils/toastHelper";
import {getUser, updatePassword, updateUser} from "../services/userService";

function Settings() {
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    user: {
      firstName: "",
      lastName: "",
      email: "",
    },
    password: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    async function fetchUser() {
      try {
        const userData = await getUser();
        setUser({
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
        });
      } catch (error) {
        console.error("Failed to fetch user data", error);
      }
    }

    fetchUser();
  }, []);

  const handleChange = (field, value) => {
    setUser({ ...user, [field]: value });
  };

  const validatePersonalInfo = () => {
    const newErrors = {
      firstName: "",
      lastName: "",
      email: "",
    };

    if (!user.firstName) newErrors.firstName = "First name is required";
    if (!user.lastName) newErrors.lastName = "Last name is required";
    if (!user.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(user.email)) {
      newErrors.email = "Email address is invalid";
    }

    setErrors((prevErrors) => ({ ...prevErrors, user: newErrors }));
    return Object.values(newErrors).every((error) => error === "");
  };

  const handleUpdatePersonalInfo = async () => {
    if (!validatePersonalInfo()) return;

    try {
      await updateUser(user);
      toastSuccess("Personal information updated successfully")
    } catch (error) {
      toastError("Failed to update personal information")
    }
  };

  const handlePasswordChange = (field, value) => {
    setPasswords({ ...passwords, [field]: value });
  };

  const validatePasswordChange = () => {
    const newErrors = {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    };

    if (!passwords.currentPassword) newErrors.currentPassword = "Current password is required";
    if (!passwords.newPassword) newErrors.newPassword = "New password is required";
    if (passwords.newPassword.length < 6) newErrors.newPassword = "New password must be at least 6 characters";
    if (passwords.newPassword !== passwords.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors((prevErrors) => ({ ...prevErrors, password: newErrors }));
    return Object.values(newErrors).every((error) => error === "");
  };

  const handleChangePassword = async () => {
    if (!validatePasswordChange()){
      return;
    }

    try {
      await updatePassword({
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });
      toastSuccess("Password updated successfully")
      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="divide-y divide-white/5">
      <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <h2 className="text-base font-semibold text-white">Personal Information</h2>
          <p className="mt-1 text-sm text-gray-400">Update your basic information below.</p>
        </div>

        <div className="md:col-span-2 space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-8">
            <div className="sm:col-span-1">
              <label htmlFor="first-name" className="block text-sm font-medium text-white">
                First name
              </label>
              <div className="mt-2">
                <input
                  id="first-name"
                  name="first-name"
                  type="text"
                  value={user.firstName}
                  onChange={(e) => handleChange("firstName", e.target.value)}
                  className="input input-bordered w-full"
                />
                {errors.user.firstName && <p className="text-red-500 text-sm mt-2">{errors.user.firstName}</p>}
              </div>
            </div>

            <div className="sm:col-span-1">
              <label htmlFor="last-name" className="block text-sm font-medium text-white">
                Last name
              </label>
              <div className="mt-2">
                <input
                  id="last-name"
                  name="last-name"
                  type="text"
                  value={user.lastName}
                  onChange={(e) => handleChange("lastName", e.target.value)}
                  className="input input-bordered w-full"
                />
                {errors.user.lastName && <p className="text-red-500 text-sm mt-2">{errors.user.lastName}</p>}
              </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="email" className="block text-sm font-medium text-white">
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={user.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className="input input-bordered w-full"
                />
                {errors.user.email && <p className="text-red-500 text-sm mt-2">{errors.user.email}</p>}
              </div>
            </div>
          </div>

          <div className="mt-8 flex">
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleUpdatePersonalInfo}
            >
              Save Personal Info
            </button>
          </div>
        </div>
      </div>

      <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <h2 className="text-base font-semibold text-white">Change Password</h2>
          <p className="mt-1 text-sm text-gray-400">
            Update your password associated with your account.
          </p>
        </div>

        <div className="md:col-span-2 space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-8">
            <div className="sm:col-span-2">
              <label htmlFor="current-password" className="block text-sm font-medium text-white">
                Current password
              </label>
              <div className="mt-2">
                <input
                  id="current-password"
                  name="current_password"
                  type="password"
                  value={passwords.currentPassword}
                  onChange={(e) => handlePasswordChange("currentPassword", e.target.value)}
                  className="input input-bordered w-full"
                />
                {errors.password.currentPassword && <p className="text-red-500 text-sm mt-2">{errors.password.currentPassword}</p>}
              </div>
            </div>

            <div className="sm:col-span-1">
              <label htmlFor="new-password" className="block text-sm font-medium text-white">
                New password
              </label>
              <div className="mt-2">
                <input
                  id="new-password"
                  name="new_password"
                  type="password"
                  value={passwords.newPassword}
                  onChange={(e) => handlePasswordChange("newPassword", e.target.value)}
                  className="input input-bordered w-full"
                />
                {errors.password.newPassword && <p className="text-red-500 text-sm mt-2">{errors.password.newPassword}</p>}
              </div>
            </div>

            <div className="sm:col-span-1">
              <label htmlFor="confirm-password" className="block text-sm font-medium text-white">
                Confirm password
              </label>
              <div className="mt-2">
                <input
                  id="confirm-password"
                  name="confirm_password"
                  type="password"
                  value={passwords.confirmPassword}
                  onChange={(e) => handlePasswordChange("confirmPassword", e.target.value)}
                  className="input input-bordered w-full"
                />
                {errors.password.confirmPassword && <p className="text-red-500 text-sm mt-2">{errors.password.confirmPassword}</p>}
              </div>
            </div>
          </div>

          <div className="mt-8 flex">
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleChangePassword}
            >
              Change Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
