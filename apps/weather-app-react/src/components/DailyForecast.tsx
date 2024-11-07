function DailyForecast({ dailyData }) {
  return (
    <div data-testid="daily-forecast-component" className="card bg-base-100 mt-4 md:mt-0 md:mx-4 shadow-xl w-full md:max-h-3/4 md:w-1/3">
      <div className="card-body overflow-x-auto scrollbar-hide">
        <h2 className="card-subtitle text-gray-500 font-semibold">7-day forecast</h2>
        <div className="divider"></div>
        <div className="flex flex-col justify-between h-full overflow-x-auto scrollbar-hide">
          {dailyData.map((day, index) => (
            <div key={index}>
              <div className="flex flex-row justify-between w-full text-md">
                <span className="flex items-center w-1/6 text-gray-500">{day.dayOfWeek.slice(0, 3)}</span>
                <span className="flex flex-row justify-center md:justify-start md:flex-col text-sm lg:flex-row 2xl:text-md items-center w-4/6 text-center font-semibold capitalize">
                  <img src={`http://openweathermap.org/img/wn/${day.weatherIcon}.png`} alt={day.weatherStatus} />
                  {day.weatherStatus}
                </span>
                <span className="flex items-center justify-end w-1/6 text-right text-md 2xl:text-lg">
                  <span className="font-semibold">{day.high}</span>
                  /
                  <span className="text-gray-500">{day.low}</span>
                </span>
              </div>
              <div className="divider"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default DailyForecast;
