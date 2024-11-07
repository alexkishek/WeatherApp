function Humidity({ data }) {
  return (
    <div data-testid="humidity-component" className="card bg-base-100 shadow-xl max-h-72 p-6 shadow-lg w-full max-w-md mx-auto justify-between">
      <div className="mb-4">
        <h2 className="card-title text-sm font-semibold text-gray-500">Humidity</h2>
        <div className="text-4xl md:text-5xl font-bold mt-1">{data.humidity}%</div>
      </div>

      <p className="mt-8 text-sm">
        The dew point is {data.dew_point}&deg; right now.
      </p>
    </div>
  )
}

export default Humidity;
