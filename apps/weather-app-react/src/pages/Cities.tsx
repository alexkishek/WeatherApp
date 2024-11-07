import { useEffect, useState } from "react";
import CitySearch from "../components/CitySearch";
import {deleteUserCity, fetchUserCities} from "../services/userService";

function Cities() {
  const [savedCities, setSavedCities] = useState([]);

  async function fetchSavedCities() {
    try {
      const data = await fetchUserCities();
      setSavedCities(data);
    } catch (error) {
      console.error("Failed to fetch saved cities");
    }
  }

  async function removeCity(cityId) {
    try {
      await deleteUserCity(cityId);
      setSavedCities((prevCities) => prevCities.filter((city) => city._id !== cityId));
    } catch (error) {
      console.error("Failed to delete saved city");
    }
  }

  const handleSaveCity = (city) => {
    console.log(city);
    fetchSavedCities();
  };

  useEffect(() => {
    fetchSavedCities();
  }, []);

  return (
    <div>
      <CitySearch onCitySave={handleSaveCity} />
      <div className="overflow-x-auto mt-12">
        <table className="table">
          <thead>
          <tr>
            <th>City Name</th>
            <th>State</th>
            <th>Country</th>
            <th>Coordinates (Lat, Lon)</th>
            <th></th>
          </tr>
          </thead>
          <tbody>
          {savedCities.length > 0 ? (
            savedCities.map((city) => (
              <tr key={city._id}>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="font-bold">{city.name}</div>
                    <div className="text-sm opacity-50">{city.state}</div>
                  </div>
                </td>
                <td>{city.state}</td>
                <td>{city.country}</td>
                <td>{city.lat}, {city.lon}</td>
                <th>
                  <button onClick={() => removeCity(city._id)} className="btn btn-ghost btn-xs text-red-500">Remove</button>
                </th>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">
                No saved cities found.
              </td>
            </tr>
          )}
          </tbody>
          <tfoot>
          <tr>
            <th>City Name</th>
            <th>State</th>
            <th>Country</th>
            <th>Coordinates (Lat, Lon)</th>
            <th></th>
          </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

export default Cities;
