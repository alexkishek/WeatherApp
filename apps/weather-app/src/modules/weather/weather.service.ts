import {HttpException, HttpStatus, Inject, Injectable, Logger} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { WeatherResponseDto } from './dto/weather-response.dto';
import {firstValueFrom} from "rxjs";
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { CityDto } from './dto/city.dto';
import {AirQualityDto} from "./dto/air-quality.dto";
import {getCachedData} from "../../utils/cache";
import { GeocodingResponse } from './interfaces/geocoding.interface';
import { AirQualityResponse } from './interfaces/air-quality.interface';

@Injectable()
export class WeatherService {
  public static readonly CACHE_TTL = 3600000;
  private static readonly BASE_GEO_URL = 'http://api.openweathermap.org/geo/1.0/direct';
  private static readonly BASE_WEATHER_URL = 'https://api.openweathermap.org/data/3.0/onecall';
  private static readonly BASE_AIR_QUALITY_URL = 'http://api.openweathermap.org/data/2.5/air_pollution';
  private static readonly BASE_REVERSE_GEO_URL = 'http://api.openweathermap.org/geo/1.0/reverse';

  private readonly apiKey: string;
  private readonly logger = new Logger(WeatherService.name);

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService
  ) {
    this.apiKey = this.configService.get<string>('OPENWEATHER_API_KEY');
  }

  private constructUrl(baseUrl: string, params: Record<string, string | number> = {}): string {
    const queryParams = new URLSearchParams({ ...params, appid: this.apiKey }).toString();
    return `${baseUrl}?${queryParams}`;
  }

  async getWeatherByCity(city: string): Promise<WeatherResponseDto> {
    const coordinates = await this.getCoordinatesFromCityName(city);

    return await this.getWeather(coordinates.lat, coordinates.lon);
  }

  async getWeather(lat: string, lon: string, unit: string = 'imperial'): Promise<WeatherResponseDto> {
    const url = this.constructUrl(WeatherService.BASE_WEATHER_URL, { lat, lon, units: unit });
    const cacheKey = `weather-${unit}-${lat}-${lon}`;

    return getCachedData(this.cacheManager, cacheKey, async () => {
      const response = await firstValueFrom(this.httpService.get(url));
      return response.data;
    }, WeatherService.CACHE_TTL);
  }

  async getAirQuality(lat: string, lon: string): Promise<AirQualityDto> {
    const url = this.constructUrl(WeatherService.BASE_AIR_QUALITY_URL, { lat, lon });
    const cacheKey = `air-quality-${lat}-${lon}`;

    return getCachedData(this.cacheManager, cacheKey, async () => {
      const response = await firstValueFrom(this.httpService.get<AirQualityResponse>(url));
      const airQualityData = response.data;

      return {
        coord: {
          lat: airQualityData.coord[0],
          lon: airQualityData.coord[1],
        },
        aqi: airQualityData.list[0].main.aqi,
      };
    }, WeatherService.CACHE_TTL);
  }

  async getCoordinatesFromCityName(city: string, state?: string, country?: string): Promise<{ lat: string; lon: string }> {
    const url = this.constructUrl(WeatherService.BASE_GEO_URL, { q: `${city}${state ? `,${state}` : ''}${country ? `,${country}` : ''}`, limit: 1 });

    try {
      const response = await firstValueFrom(
        this.httpService.get<GeocodingResponse[]>(url)
      );
      const data = response.data;

      if (data.length === 0) {
        throw new HttpException('City not found', HttpStatus.NOT_FOUND);
      }

      return { lat: data[0].lat.toString(), lon: data[0].lon.toString() };
    } catch (error) {
      throw new HttpException('Failed to retrieve coordinates', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getCitiesBySearch(search: string): Promise<CityDto[]> {
    const url = this.constructUrl(WeatherService.BASE_GEO_URL, { q: `${search}`, limit: 10 });

    try {
      const response = await firstValueFrom(
        this.httpService.get<GeocodingResponse[]>(url)
      );
      const data = response.data;

      const cities: CityDto[] = data.map((city) => ({
        name: city.name,
        state: city.state,
        country: city.country,
        lat: city.lat,
        lon: city.lon,
      }));

      return cities;
    } catch (error) {
      this.logger.error('Failed to retrieve city data', error);
      throw new HttpException('Failed to retrieve coordinates', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getCityByCoordinates(lat: string, lon: string): Promise<CityDto> {
    const url = this.constructUrl(WeatherService.BASE_REVERSE_GEO_URL, { lat, lon, limit: 1 });

    try {
      const response = await firstValueFrom(this.httpService.get<GeocodingResponse[]>(url));
      const data = response.data;

      if (data.length === 0) {
        throw new HttpException('Location not found', HttpStatus.NOT_FOUND);
      }

      const cityData = data[0];
      return {
        name: cityData.name,
        state: cityData.state,
        country: cityData.country,
        lat: cityData.lat,
        lon: cityData.lon,
      };
    } catch (error) {
      this.logger.error('Failed to retrieve city by coordinates', error);
      throw new HttpException('Failed to retrieve location', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
