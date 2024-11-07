import { FaCloudSun, FaSun, FaSnowflake, FaCloud, FaUmbrella } from 'react-icons/fa';
import { FaCloudBolt } from 'react-icons/fa6';

const iconMap = {
  2: FaCloudBolt,
  3: FaUmbrella,
  5: FaUmbrella,
  6: FaSnowflake,
  7: FaCloud,
  800: FaSun,
  8: FaCloudSun
};

const colorMap = {
  2: 'text-yellow-600',
  3: 'text-blue-400',
  5: 'text-blue-500',
  6: 'text-blue-300',
  7: 'text-gray-400',
  800: 'text-yellow-500',
  8: 'text-gray-500'
};

function Overview({ city, data }) {
  const weatherGroup = Math.floor(data.currentStatusId / 100);
  const isClearSky = data.currentStatusId === 800;

  const IconComponent = iconMap[isClearSky ? 800 : weatherGroup] || FaSun;
  const iconColorClass = colorMap[isClearSky ? 800 : weatherGroup] || 'text-yellow-500';

  return (
    <div data-testid="overview-component" className="card bg-base-100 shadow-xl h-64">
      <div className="card-body flex flex-row justify-between">
        <div className="flex flex-col justify-between">
          <h1 className="text-4xl">{city}</h1>
          <span className="text-8xl">{data.temperature}&deg;</span>
        </div>

        <IconComponent className={`mb-2 text-[200px] ${iconColorClass}`} />
      </div>
    </div>
  );
}

export default Overview;
