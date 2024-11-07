import React from 'react';

function parseTime(timeStr) {
  const [hour, minute, period] = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i).slice(1);
  const date = new Date();
  date.setHours(period.toUpperCase() === 'PM' && hour !== '12' ? parseInt(hour, 10) + 12 : parseInt(hour, 10));
  date.setMinutes(parseInt(minute, 10));
  return date;
}

function getNextEventTime(currentTime, sunrise, sunset) {
  if (currentTime > sunset) {
    return { nextLabel: 'Sunrise', nextTime: sunrise, otherLabel: 'Sunset', otherTime: sunset };
  }
  return { nextLabel: 'Sunset', nextTime: sunset, otherLabel: 'Sunrise', otherTime: sunrise };
}

function SunriseSunset({ data }) {
  const currentTime = new Date();
  const sunrise = parseTime(data.sunriseTime);
  const sunset = parseTime(data.sunsetTime);

  const { nextLabel, nextTime, otherLabel, otherTime } = getNextEventTime(currentTime, sunrise, sunset);

  return (
    <div data-testid="sunrise-sunset-component" className="card bg-base-100 shadow-xl max-h-72 p-6 shadow-lg w-full max-w-md mx-auto justify-between">
      <div className="mb-4">
        <h2 className="card-title text-sm font-semibold text-gray-500">{nextLabel}</h2>
        <div className="text-4xl md:text-5xl font-bold mt-1">{data[nextLabel.toLowerCase() + "Time"]}</div>
      </div>

      <p className="mt-8 text-sm">
        {otherLabel}: {data[otherLabel.toLowerCase() + "Time"]}
      </p>
    </div>
  );
}

export default SunriseSunset;
