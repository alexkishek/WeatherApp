function AirQuality({ data }) {
  const gradient = {
    background: 'linear-gradient(to right, green, yellow, orange, red, maroon)',
  };

  const leftPositionAqi = `${(data.aqi / 5) * 100}%`;

  function getAQIStatus(aqi) {
    switch (aqi) {
      case 1:
        return 'Good';
      case 2:
        return 'Fair';
      case 3:
        return 'Moderate';
      case 4:
        return 'Poor';
      case 5:
        return 'Very Poor';
      default:
        return 'Unknown';
    }
  }

  return (
    <div data-testid="air-quality-component" className="card bg-base-100 shadow-xl max-h-72 p-6 shadow-lg w-full max-w-md mx-auto justify-between">
      <div className="mb-4">
        <h2 className="card-title text-sm font-semibold text-gray-500">Air Quality</h2>
        <div className="text-5xl font-bold mt-1">{data.aqi}</div>
        <div className="text-xl">{getAQIStatus(data.aqi)}</div>
      </div>

      <div className="relative mt-4 h-2 w-full rounded-full" style={gradient}>
        <div
          className="absolute top-[-4px] h-4 w-1 bg-gray-500 rounded-full"
          style={{ left: leftPositionAqi, transform: 'translateX(-50%)' }}
        />
      </div>
    </div>
  )
}

export default AirQuality;
