function UVIndex({ data }) {
  const gradient = {
    background: 'linear-gradient(to right, green, yellow, orange, red, maroon)',
  };

  const leftPositionUV = `${(data.uvIndex / 5) * 100}%`;

  function getUVStatus(uvIndex) {
    if (uvIndex >= 0 && uvIndex <= 5) {
      return 'Low';
    } else if (uvIndex >= 6 && uvIndex <= 7) {
      return 'Moderate';
    } else if (uvIndex >= 8 && uvIndex <= 10) {
      return 'High';
    } else if (uvIndex >= 11) {
      return 'Very High';
    } else {
      return 'Unknown';
    }
  }

  return (
    <div data-testid="uv-index-component" className="card bg-base-100 shadow-xl max-h-72 p-6 shadow-lg w-full max-w-md mx-auto justify-between">
      <div className="mb-4">
        <h2 className="card-title text-sm font-semibold text-gray-500">UV Index</h2>
        <div className="text-5xl font-bold mt-1">{data.uvIndex}</div>
        <div className="text-xl">{getUVStatus(data.uvIndex)}</div>
      </div>

      <div className="relative mt-4 h-2 w-full rounded-full" style={gradient}>
        <div
          className="absolute top-[-4px] h-4 w-1 bg-gray-500 rounded-full"
          style={{ left: leftPositionUV, transform: 'translateX(-50%)' }}
        />
      </div>
    </div>
  )
}

export default UVIndex;
