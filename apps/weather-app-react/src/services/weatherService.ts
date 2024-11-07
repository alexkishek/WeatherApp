import apiClient from "../config/axios";

export async function fetchWeather(lat, lon, unit) {
  try {
    const response = await apiClient.get(`/weather/coordinates?lat=${lat}&lon=${lon}&unit=${unit}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching weather data', error);
    throw error;
  }
}

export async function fetchAirQuality(lat, lon) {
  try {
    const response = await apiClient.get(`/weather/quality/coordinates?lat=${lat}&lon=${lon}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching air quality data', error);
    throw error;
  }
}

export async function fetchCityByCoordinates(lat, lon) {
  try {
    const response = await apiClient.get(`/weather/city-by-coordinates?lat=${lat}&lon=${lon}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching city by coordinates", error);
    throw error;
  }
}
