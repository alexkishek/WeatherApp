import { Controller, Get, Query, UseInterceptors } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { WeatherService } from './weather.service';
import { WeatherTransformInterceptor } from './interceptors/weather-transform.interceptor';
import { WeatherResponseDto } from './dto/weather-response.dto';
import { AirQualityDto } from './dto/air-quality.dto';
import {CityDto} from "./dto/city.dto";

@ApiTags('weather')
@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get('city')
  @UseInterceptors(WeatherTransformInterceptor)
  @ApiOperation({ summary: 'Get weather by city name', description: 'Fetches weather data for a specific city.' })
  @ApiQuery({ name: 'city', description: 'Name of the city to retrieve weather data for', example: 'Detroit' })
  @ApiResponse({
    status: 200,
    description: 'Weather data retrieved successfully',
    type: WeatherResponseDto,
    examples: {
      example: {
        summary: 'Sample weather data',
        value: {
          temperature: 72,
          high: 75,
          low: 65,
          hourlyBreakdown: [
            { time: '9 AM', temperature: 70, weatherStatus: 'clear sky', weatherIcon: '01d' },
          ],
          dailyForecast: [
            { dayOfWeek: 'Monday', weatherStatus: 'few clouds', weatherIcon: '02d', high: 75, low: 65 },
          ],
          uvIndex: 5,
          sunriseTime: '6:45 AM',
          sunsetTime: '7:45 PM',
          windData: { speed: 10, direction: 180 },
          feelsLike: 72,
          precipitation: 0,
          humidity: 50,
          dew_point: 50,
          visibility: 10000,
          currentStatusId: 801,
          currentStatus: 'Few clouds',
          currentStatusIcon: '02d',
        },
      },
    },
  })
  getWeatherByCity(
    @Query('city') city: string
  ) {
    return this.weatherService.getWeatherByCity(city);
  }

  @Get('coordinates')
  @UseInterceptors(WeatherTransformInterceptor)
  @ApiOperation({ summary: 'Get weather by coordinates', description: 'Fetches weather data based on latitude and longitude.' })
  @ApiQuery({ name: 'lat', description: 'Latitude coordinate', example: '42.3314' })
  @ApiQuery({ name: 'lon', description: 'Longitude coordinate', example: '-83.0458' })
  @ApiResponse({
    status: 200,
    description: 'Weather data retrieved successfully',
    type: WeatherResponseDto,
    examples: {
      example: {
        summary: 'Sample weather data by coordinates',
        value: {
          temperature: 72,
          high: 75,
          low: 65,
          hourlyBreakdown: [
            { time: '10 AM', temperature: 70, weatherStatus: 'clear sky', weatherIcon: '01d' },
          ],
          dailyForecast: [
            { dayOfWeek: 'Tuesday', weatherStatus: 'few clouds', weatherIcon: '02d', high: 75, low: 65 },
          ],
          uvIndex: 5,
          sunriseTime: '6:45 AM',
          sunsetTime: '7:45 PM',
          windData: { speed: 12, direction: 200 },
          feelsLike: 70,
          precipitation: 0,
          humidity: 48,
          dew_point: 48,
          visibility: 10000,
          currentStatusId: 800,
          currentStatus: 'Clear sky',
          currentStatusIcon: '01d',
        },
      },
    },
  })
  getWeatherByCoordinates(
    @Query('lat') lat: string,
    @Query('lon') lon: string,
    @Query('unit') unit?: string
  ) {
    return this.weatherService.getWeather(lat, lon, unit);
  }

  @Get('quality/coordinates')
  @ApiOperation({ summary: 'Get air quality by coordinates', description: 'Fetches air quality data based on latitude and longitude.' })
  @ApiQuery({ name: 'lat', description: 'Latitude coordinate', example: '42.3314' })
  @ApiQuery({ name: 'lon', description: 'Longitude coordinate', example: '-83.0458' })
  @ApiResponse({
    status: 200,
    description: 'Air quality data retrieved successfully',
    type: AirQualityDto,
    examples: {
      example: {
        summary: 'Sample air quality data',
        value: {
          coord: { lat: 42.3314, lon: -83.0458 },
          aqi: 3,
        },
      },
    },
  })
  getAirQualityByCoordinates(
    @Query('lat') lat: string,
    @Query('lon') lon: string
  ) {
    return this.weatherService.getAirQuality(lat, lon);
  }

  @Get('cities')
  @ApiOperation({ summary: 'Search cities', description: 'Searches cities by name.' })
  @ApiQuery({ name: 'search', description: 'City name or partial name to search for', example: 'Detroit' })
  @ApiResponse({
    status: 200,
    description: 'City search results retrieved successfully',
    schema: {
      example: [
        { name: 'Detroit', state: 'Michigan', country: 'US', lat: 42.3314, lon: -83.0458 },
        { name: 'Dallas', state: 'Texas', country: 'US', lat: 32.7767, lon: -96.797 },
      ],
    },
  })
  async getCities(
    @Query('search') search: string
  ) {
    return this.weatherService.getCitiesBySearch(search);
  }

  @Get('city-by-coordinates')
  @ApiOperation({
    summary: 'Get city information by coordinates',
    description: 'Fetches city, state, and country based on latitude and longitude.',
  })
  @ApiQuery({ name: 'lat', description: 'Latitude coordinate', example: '42.3315509' })
  @ApiQuery({ name: 'lon', description: 'Longitude coordinate', example: '-83.0466403' })
  @ApiResponse({
    status: 200,
    description: 'City data retrieved successfully',
    type: CityDto,
    examples: {
      example: {
        summary: 'Sample city data',
        value: {
          name: 'Detroit',
          state: 'Michigan',
          country: 'US',
          lat: 42.3315509,
          lon: -83.0466403,
        },
      },
    },
  })
  async getCityByCoordinates(
    @Query('lat') lat: string,
    @Query('lon') lon: string
  ): Promise<CityDto> {
    return this.weatherService.getCityByCoordinates(lat, lon);
  }

  @Get('alerts')
  @ApiOperation({ 
    summary: 'Get weather alerts for location', 
    description: 'Fetches severe weather alerts based on coordinates.' 
  })
  async getWeatherAlerts(
    @Query('lat') lat: string,
    @Query('lon') lon: string,
    @Query('radius') radius: string
  ) {
    const alerts = await this.weatherService.getWeatherAlerts(lat, lon, radius);
    
    return alerts;
  }
}
