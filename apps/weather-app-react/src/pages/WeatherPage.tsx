import { useEffect, useState } from "react";
import apiClient from "../config/axios";
import HourlyForecast from "../components/HourlyForecast";
import DailyForecast from "../components/DailyForecast";
import Overview from "../components/Overview";
import CitySearch from "../components/CitySearch";
import AirQuality from "../components/AirQuality";
import Humidity from "../components/Humidity";
import SunriseSunset from "../components/SunriseSunset";
import UVIndex from "../components/UVIndex";
import { isAuthenticated } from "../utils/authUtils";
import SmallCard from "../components/skeletons/SmallCard";
import WideCard from "../components/skeletons/WideCard";
import VerticalCard from "../components/skeletons/VerticalCard";
import {fetchAirQuality, fetchCityByCoordinates, fetchWeather} from "../services/weatherService";
import {fetchUserCities} from "../services/userService";

function WeatherPage() {
  const defaultCity = {
    name: "Detroit",
    state: "Michigan",
    country: "US",
    lat: 42.3315509,
    lon: -83.0466403,
  };

  const [weatherData, setWeatherData] = useState(null);
  const [airQualityData, setAirQualityData] = useState(null);
  const [selectedCity, setSelectedCity] = useState(defaultCity);
  const [savedCities, setSavedCities] = useState([]);
  const [unit, setUnit] = useState(localStorage.getItem('unit') || 'imperial');

  const fetchWeatherData = async (city, newUnit = unit) => {
    try {
      const data = await fetchWeather(city.lat, city.lon, newUnit);
      setWeatherData(data);
    } catch (error) {
      console.error('Failed to fetch weather data');
    }
  };

  const fetchAirQualityData = async (city) => {
    try {
      const data = await fetchAirQuality(city.lat, city.lon);
      setAirQualityData(data);
    } catch (error) {
      console.error('Failed to fetch air quality data');
    }
  };

  const handleCitySelect = (city) => {
    setSelectedCity(city);
    fetchAirQualityData(city);
    fetchWeatherData(city);
  };

  const handleSavedCitySelect = (event) => {
    const cityId = event.target.value;
    const city = savedCities.find((c) => c._id === cityId);
    if (city) {
      handleCitySelect(city);
    }
  };

  const fetchSavedCities = async () => {
    if (!isAuthenticated()) {
      return;
    }
    try {
      const cities = await fetchUserCities();
      setSavedCities(cities);
    } catch (error) {
      console.error('Failed to fetch saved cities');
    }
  };

  const handleCitySave = () => {
    fetchSavedCities();
  };

  const handleUnitChanged = (e) => {
    const newUnit = e.target.checked ? 'metric' : 'imperial';
    setUnit(newUnit);
    localStorage.setItem('unit', newUnit);
    fetchWeatherData(selectedCity, newUnit);
  };

  const initializeLocation = async () => {
    const storedLocation = localStorage.getItem("userLocation");

    if (storedLocation) {
      const cachedCity = JSON.parse(storedLocation);
      setSelectedCity(cachedCity);
      fetchWeatherData(cachedCity);
      fetchAirQualityData(cachedCity);
    } else if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const city = await fetchCityByCoordinates(latitude, longitude);
            const currentCity = {
              name: city.name,
              state: city.state || "",
              country: city.country,
              lat: latitude,
              lon: longitude,
            };
            setSelectedCity(currentCity);
            localStorage.setItem("userLocation", JSON.stringify(currentCity));
            fetchWeatherData(currentCity);
            fetchAirQualityData(currentCity);
          } catch (error) {
            setSelectedCity(defaultCity);
            fetchWeatherData(defaultCity);
            fetchAirQualityData(defaultCity);
          }
        },
        () => {
          fetchWeatherData(defaultCity);
          fetchAirQualityData(defaultCity);
        }
      );
    } else {
      fetchWeatherData(defaultCity);
      fetchAirQualityData(defaultCity);
    }
  };

  useEffect(() => {
    initializeLocation();
    fetchSavedCities();
  }, []);

  return (
    <div>
      <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row justify-between md:mr-4">
        <CitySearch
          onCitySelect={handleCitySelect}
          onCitySave={handleCitySave}
          currentCity={selectedCity}
        />
        <div className={'flex justify-end md:justify-between space-x-4'}>
          {isAuthenticated() ? (
            <>
              <select
                className="select w-full "
                onChange={handleSavedCitySelect}
                value={selectedCity._id || ""}
              >
                <option disabled value="">
                  Select a saved city
                </option>
                {savedCities.map((city) => (
                  <option key={city._id} value={city._id}>
                    {city.name}
                    {city.state ? `, ${city.state}` : ""}, {city.country}
                  </option>
                ))}
              </select>
            </>
          ) : null}
          <div className={'flex justify-center items-center'}>
            <label className="flex cursor-pointer gap-2">
              <span className="label-text">F&deg;</span>
              <input
                onChange={handleUnitChanged}
                checked={unit === 'metric'}
                type="checkbox"
                className="toggle"
              />
              <span className="label-text">C&deg;</span>
            </label>
          </div>
        </div>
      </div>
      {weatherData ? (
          <div>
            <div className="flex flex-col md:flex-row mt-8 w-full">
              <div className="md:w-2/3 space-y-4">
                <Overview city={selectedCity.name} data={weatherData} />
                <HourlyForecast hourlyData={weatherData.hourlyBreakdown} currentStatus={weatherData.dailyForecast[0].summary} />
                <div className="w-full grid grid-cols-2 gap-4">
                  {airQualityData && <AirQuality data={airQualityData} />}
                  <Humidity data={weatherData} />
                  <SunriseSunset data={weatherData} />
                  <UVIndex data={weatherData} />
                </div>
              </div>
              <DailyForecast dailyData={weatherData.dailyForecast} />
            </div>
          </div>
        ) :
        <div>
          <div className="flex flex-col md:flex-row mt-8 w-full">
            <div className="md:w-2/3 space-y-4">
              <WideCard />
              <WideCard />
              <div className="w-full grid grid-cols-2 gap-4">
                <SmallCard  />
                <SmallCard  />
                <SmallCard  />
                <SmallCard  />
              </div>
            </div>
            <VerticalCard />
          </div>
        </div>
      }
    </div>
  );
}

export default WeatherPage;
