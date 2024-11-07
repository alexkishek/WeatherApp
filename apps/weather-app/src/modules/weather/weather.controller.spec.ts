import { Test, TestingModule } from '@nestjs/testing';
import { WeatherController } from './weather.controller';
import { WeatherService } from './weather.service';
import { WeatherResponseDto } from './dto/weather-response.dto';
import { AirQualityDto } from './dto/air-quality.dto';

describe('WeatherController', () => {
  let controller: WeatherController;
  let weatherService: WeatherService;

  const mockWeatherService = {
    getWeatherByCity: jest.fn(),
    getWeather: jest.fn(),
    getAirQuality: jest.fn(),
    getCitiesBySearch: jest.fn(),
  };

  const mockWeatherData: WeatherResponseDto = {
    temperature: 72,
    high: 72,
    low: 51,
    hourlyBreakdown: [
      { time: '5 PM', temperature: 72, weatherStatus: 'few clouds', weatherIcon: '02d' },
      { time: '6 PM', temperature: 72, weatherStatus: 'clear sky', weatherIcon: '01n' },
    ],
    dailyForecast: [
      { dayOfWeek: 'Tuesday', weatherStatus: 'moderate rain', summary: 'Expect a day of partly cloudy with rain', weatherIcon: '10d', high: 72, low: 65 },
      { dayOfWeek: 'Wednesday', weatherStatus: 'moderate rain', summary: 'Expect a day of partly cloudy with rain', weatherIcon: '10d', high: 67, low: 55 },
    ],
    uvIndex: 0,
    sunriseTime: '7:11 AM',
    sunsetTime: '5:20 PM',
    windData: { speed: 17.27, direction: 200 },
    feelsLike: 72,
    precipitation: 4.52,
    humidity: 68,
    dew_point: 61.09,
    visibility: 10000,
    currentStatusId: 800,
    currentStatus: 'Clear',
    currentStatusIcon: '01n',
  };

  const mockAirQualityData: AirQualityDto = {
    coord: { lat: 42.3314, lon: -83.0458 },
    aqi: 3,
  };

  const mockCities = [
    { name: 'Detroit', state: 'Michigan', country: 'US', lat: 42.3314, lon: -83.0458 },
    { name: 'Dallas', state: 'Texas', country: 'US', lat: 32.7767, lon: -96.797 },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WeatherController],
      providers: [
        {
          provide: WeatherService,
          useValue: mockWeatherService,
        },
      ],
    }).compile();

    controller = module.get<WeatherController>(WeatherController);
    weatherService = module.get<WeatherService>(WeatherService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getWeatherByCity', () => {
    it('should return weather data for a given city', async () => {
      mockWeatherService.getWeatherByCity.mockResolvedValue(mockWeatherData);

      const result = await controller.getWeatherByCity('Detroit');
      expect(mockWeatherService.getWeatherByCity).toHaveBeenCalledWith('Detroit');
      expect(result).toEqual(mockWeatherData);
    });
  });

  describe('getWeatherByCoordinates', () => {
    it('should return weather data for given coordinates', async () => {
      mockWeatherService.getWeather.mockResolvedValue(mockWeatherData);

      const result = await controller.getWeatherByCoordinates('42.3314', '-83.0458', 'imperial');
      expect(mockWeatherService.getWeather).toHaveBeenCalledWith('42.3314', '-83.0458', 'imperial');
      expect(result).toEqual(mockWeatherData);
    });
  });

  describe('getAirQualityByCoordinates', () => {
    it('should return air quality data for given coordinates', async () => {
      mockWeatherService.getAirQuality.mockResolvedValue(mockAirQualityData);

      const result = await controller.getAirQualityByCoordinates('42.3314', '-83.0458');
      expect(mockWeatherService.getAirQuality).toHaveBeenCalledWith('42.3314', '-83.0458');
      expect(result).toEqual(mockAirQualityData);
    });
  });

  describe('getCities', () => {
    it('should return a list of cities based on the search term', async () => {
      mockWeatherService.getCitiesBySearch.mockResolvedValue(mockCities);

      const result = await controller.getCities('D');
      expect(mockWeatherService.getCitiesBySearch).toHaveBeenCalledWith('D');
      expect(result).toEqual(mockCities);
    });
  });
});
