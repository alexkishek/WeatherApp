import { Test, TestingModule } from '@nestjs/testing';
import { WeatherService } from './weather.service';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import {  HttpException, Logger } from '@nestjs/common';
import { of, throwError } from 'rxjs';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {WeatherResponseDto} from "./dto/weather-response.dto";


describe('WeatherService', () => {
  let service: WeatherService;
  let httpService: HttpService;
  let cacheManager: Cache;

  const mockCacheManager = {
    get: jest.fn(),
    set: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn().mockReturnValue('testApiKey'),
  };

  const mockHttpService = {
    get: jest.fn(),
  };

  const mockWeatherData = {
    data: {
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
    } as WeatherResponseDto,
  };

  const mockAirQualityData = {
    data: {
      coord: [42.3314, -83.0458],
      list: [
        {
          main: { aqi: 3 }
        }
      ]
    },
  };

  const mockCoordinates = { lat: '42.3314', lon: '-83.0458' };

  const mockCities = [
    { name: 'Detroit', state: 'Michigan', country: 'US', lat: 42.3314, lon: -83.0458 },
    { name: 'Dallas', state: 'Texas', country: 'US', lat: 32.7767, lon: -96.797 },
  ];

  beforeEach(async () => {
    jest.spyOn(Logger.prototype, 'error').mockImplementation(() => {});

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WeatherService,
        { provide: HttpService, useValue: mockHttpService },
        { provide: ConfigService, useValue: mockConfigService },
        { provide: CACHE_MANAGER, useValue: mockCacheManager },
      ],
    }).compile();

    service = module.get<WeatherService>(WeatherService);
    httpService = module.get<HttpService>(HttpService);
    cacheManager = module.get<Cache>(CACHE_MANAGER);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getWeatherByCity', () => {
    it('should return weather data for a given city', async () => {
      jest.spyOn(service, 'getCoordinatesFromCityName').mockResolvedValue(mockCoordinates);
      jest.spyOn(service, 'getWeather').mockResolvedValue(mockWeatherData.data);

      const result = await service.getWeatherByCity('Detroit');
      expect(service.getCoordinatesFromCityName).toHaveBeenCalledWith('Detroit');
      expect(service.getWeather).toHaveBeenCalledWith(mockCoordinates.lat, mockCoordinates.lon);
      expect(result).toEqual(mockWeatherData.data);
    });
  });

  describe('getWeather', () => {
    it('should return weather data from cache if available', async () => {
      mockCacheManager.get.mockResolvedValue(mockWeatherData.data);
      const result = await service.getWeather(mockCoordinates.lat, mockCoordinates.lon);

      expect(mockCacheManager.get).toHaveBeenCalledWith(`weather-imperial-${mockCoordinates.lat}-${mockCoordinates.lon}`);
      expect(result).toEqual(mockWeatherData.data);
    });

    it('should fetch and cache weather data if not in cache', async () => {
      mockCacheManager.get.mockResolvedValue(null);
      mockHttpService.get.mockReturnValue(of(mockWeatherData));
      const result = await service.getWeather(mockCoordinates.lat, mockCoordinates.lon);

      expect(mockHttpService.get).toHaveBeenCalledWith(expect.stringContaining(`lat=${mockCoordinates.lat}&lon=${mockCoordinates.lon}`));
      expect(mockCacheManager.set).toHaveBeenCalledWith(`weather-imperial-${mockCoordinates.lat}-${mockCoordinates.lon}`, mockWeatherData.data, expect.any(Number));
      expect(result).toEqual(mockWeatherData.data);
    });

    it('should throw an error if fetching weather data fails', async () => {
      mockCacheManager.get.mockResolvedValue(null);
      mockHttpService.get.mockReturnValue(throwError(() => new Error()));

      await expect(service.getWeather(mockCoordinates.lat, mockCoordinates.lon)).rejects.toThrow(HttpException);
    });
  });

  describe('getAirQuality', () => {
    it('should return air quality data from cache if available', async () => {
      mockCacheManager.get.mockResolvedValue(mockAirQualityData.data);
      const result = await service.getAirQuality(mockCoordinates.lat, mockCoordinates.lon);

      expect(mockCacheManager.get).toHaveBeenCalledWith(`air-quality-${mockCoordinates.lat}-${mockCoordinates.lon}`);
      expect(result).toEqual(mockAirQualityData.data);
    });

    it('should fetch and cache air quality data if not in cache', async () => {
      mockCacheManager.get.mockResolvedValue(null);
      mockHttpService.get.mockReturnValue(of(mockAirQualityData));

      const result = await service.getAirQuality(mockCoordinates.lat, mockCoordinates.lon);

      const expectedAirQualityData = {
        coord: {
          lat: mockAirQualityData.data.coord[0],
          lon: mockAirQualityData.data.coord[1],
        },
        aqi: mockAirQualityData.data.list[0].main.aqi,
      };

      expect(mockHttpService.get).toHaveBeenCalledWith(expect.stringContaining(`lat=${mockCoordinates.lat}&lon=${mockCoordinates.lon}`));
      expect(mockCacheManager.set).toHaveBeenCalledWith(`air-quality-${mockCoordinates.lat}-${mockCoordinates.lon}`, expectedAirQualityData, WeatherService.CACHE_TTL);
      expect(result).toEqual(expectedAirQualityData);
    });

    it('should throw an error if fetching air quality data fails', async () => {
      mockCacheManager.get.mockResolvedValue(null);
      mockHttpService.get.mockReturnValue(throwError(() => new Error()));

      await expect(service.getAirQuality(mockCoordinates.lat, mockCoordinates.lon)).rejects.toThrow(HttpException);
    });
  });

  describe('getCoordinatesFromCityName', () => {
    it('should return coordinates for a given city', async () => {
      mockHttpService.get.mockReturnValue(of({ data: [{ lat: 42.3314, lon: -83.0458 }] }));

      const result = await service.getCoordinatesFromCityName('Detroit');
      expect(mockHttpService.get).toHaveBeenCalledWith(expect.stringContaining('q=Detroit'));
      expect(result).toEqual({ lat: '42.3314', lon: '-83.0458' });
    });

    it('should throw NotFoundException if city is not found', async () => {
      mockHttpService.get.mockReturnValue(of({ data: [] }));

      await expect(service.getCoordinatesFromCityName('UnknownCity')).rejects.toThrow(HttpException);
    });
  });

  describe('getCitiesBySearch', () => {
    it('should return a list of cities matching the search term', async () => {
      mockHttpService.get.mockReturnValue(of({ data: mockCities }));

      const result = await service.getCitiesBySearch('Detroit');
      expect(mockHttpService.get).toHaveBeenCalledWith(expect.stringContaining('q=Detroit'));
      expect(result).toEqual(mockCities);
    });

    it('should throw an error if fetching cities data fails', async () => {
      mockHttpService.get.mockReturnValue(throwError(() => new Error('Failed to fetch data')));

      await expect(service.getCitiesBySearch('Detroit')).rejects.toThrow(HttpException);
    });
  });
});
