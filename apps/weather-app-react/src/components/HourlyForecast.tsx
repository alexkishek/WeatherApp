function HourlyForecast({ hourlyData, currentStatus }) {
  return (
    <div data-testid="hourly-forecast-component" className="card bg-base-100 w-full shadow-xl">
      <div className="card-body">
        <h2 className="card-subtitle">{currentStatus}</h2>
        <div className="divider"></div>
        <div className="flex overflow-x-auto space-x-8 scrollbar-hide">
          {hourlyData.map((hour, index) => (
            <div key={index} className="flex flex-col items-center min-w-12">
              <p className="text-xs">{hour.time}</p>
              <p className="text-2xl"><span><img src={`http://openweathermap.org/img/wn/${hour.weatherIcon}.png`} alt={hour.weatherStatus} /></span></p>
              <p className="text-lg font-semibold">{hour.temperature}&deg;</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default HourlyForecast;
