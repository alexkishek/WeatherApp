import apiClient from "../config/axios";
import {toastError, toastSuccess} from "../utils/toastHelper";

export async function getUser() {
  try {
    const response = await apiClient.get(`/user/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user data", error);
    throw error;
  }
}

export async function updateUser(data) {
  try {
    const response = await apiClient.put(`/user/`, data);
    return response.data;
  } catch (error) {
    console.error("Error updating user data", error);
    throw error;
  }
}

export async function updatePassword(data) {
  try {
    const response = await apiClient.put(`/user/update-password`, data);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      const errorMessage = error.response.data.message;
      toastError(errorMessage);
    } else {
      toastError("An error occurred while updating password.");
    }
    throw error;
  }
}

export async function fetchCities(search) {
  try {
    const response = await apiClient.get(`/weather/cities?search=${search}`);
    return response.data.map(city => ({
      ...city,
      state: city.state || null,
    }));
  } catch (error) {
    console.error("Error fetching city data", error);
    throw error;
  }
}

export async function saveCity(city) {
  try {
    const response = await apiClient.put(`/user/cities`, city);
    toastSuccess(city.name + ' saved!');
    return response.data;
  } catch (error) {
    toastError('Failed to save ' + city.name);
    throw error;
  }
}

export async function fetchUserCities() {
  try {
    const response = await apiClient.get(`/user/cities`);
    return response.data;
  } catch (error) {
    console.error("Error fetching saved cities", error);
    return [];
  }
}

export async function deleteUserCity(cityId) {
  try {
    const response = await apiClient.delete(`/user/cities/${cityId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting saved city", error);
    throw error;
  }
}


