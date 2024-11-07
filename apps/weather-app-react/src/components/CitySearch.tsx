import { useCallback, useState, useEffect } from "react";
import { debounce } from "lodash";
import { toastError, toastSuccess } from "../utils/toastHelper";
import { isAuthenticated } from "../utils/authUtils";
import {fetchCities, fetchUserCities, saveCity} from "../services/userService";

function CitySearch({ onCitySelect, onCitySave, currentCity }) {
  const [inputValue, setInputValue] = useState("");
  const [cityOptions, setCityOptions] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [savedCities, setSavedCities] = useState([]);

  const debouncedGetCities = useCallback(
    debounce(async (searchCity) => {
      if (searchCity.trim().length > 1) {
        const cities = await fetchCities(searchCity);
        setCityOptions(cities);
      }
    }, 500),
    []
  );

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    debouncedGetCities(newValue);
  };

  const handleCitySelect = (selected) => {
    const selectedCityWithNullState = {
      ...selected,
      state: selected.state || '',
    };

    const cityDisplay = selectedCityWithNullState.state
      ? `${selectedCityWithNullState.name}, ${selectedCityWithNullState.state}`
      : selectedCityWithNullState.name;

    setInputValue(cityDisplay);
    setCityOptions([]);
    setSelectedCity(selected);
    onCitySelect(selected);
  };

  const handleSaveCity = async () => {
    const cityToSave = selectedCity || currentCity;

    if (cityToSave) {
      try {
        await saveCity(cityToSave);
        setSavedCities((prevCities) => [...prevCities, cityToSave]);
        onCitySave(cityToSave);
      } catch (error) {
        toastError('Failed to save city');
      }
    }
  };

  useEffect(() => {
    if (isAuthenticated()) {
      fetchUserCities().then((data) => setSavedCities(data));
    }
  }, []);

  useEffect(() => {
    if (currentCity) {
      const cityDisplay = currentCity.state
        ? `${currentCity.name}, ${currentCity.state}`
        : currentCity.name;
      setInputValue(cityDisplay);
      setSelectedCity(currentCity);
    }
  }, [currentCity]);

  const isCitySaved = savedCities.some(
    (city) =>
      city.name === (selectedCity?.name || currentCity?.name) &&
      city.state === (selectedCity?.state || currentCity?.state) &&
      city.country === (selectedCity?.country || currentCity?.country)
  );

  return (
    <div className="flex flex-row space-x-4 w-full md:w-2/3">
      <div className="relative w-full md:w-1/2">
        <input
          type="text"
          placeholder="Search"
          className="input outline-none focus:border-none focus:outline-none rounded-lg bg-base-100 w-full"
          value={inputValue}
          onChange={handleInputChange}
        />
        {cityOptions.length > 0 && (
          <ul className="absolute top-full left-0 w-full mt-2 bg-base-100 shadow-xl rounded-lg z-10">
            {cityOptions.map((option) => (
              <li
                key={`${option.name}-${option.state}-${option.country}`}
                onClick={() => handleCitySelect(option)}
                className="p-2 cursor-pointer hover:bg-gray-200 hover:text-gray-700"
              >
                {option.name}, {option.state ? option.state + ', ' : ''}{option.country}
              </li>
            ))}
          </ul>
        )}
      </div>
      {isAuthenticated() && !isCitySaved && (
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleSaveCity}
        >
          Save City
        </button>
      )}
    </div>
  );
}

export default CitySearch;
