import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { OpenWeatherResponse, TransformedWeatherData } from '../interfaces/openweather-api.interface';

@Injectable()
export class WeatherTransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<TransformedWeatherData> {
    return next.handle().pipe(
      map((data: OpenWeatherResponse) => {
        return this.parseWeatherData(data);
      })
    );
  }

  private parseWeatherData(data: OpenWeatherResponse): TransformedWeatherData {
    return {
      temperature: Math.round(data.current.temp),
      high: Math.round(Math.max(...data.hourly.map((hour) => hour.temp))),
      low: Math.round(Math.min(...data.hourly.map((hour) => hour.temp))),
      hourlyBreakdown: data.hourly.map((hour) => ({
        time: new Date(hour.dt * 1000).toLocaleTimeString('en-US', {
          timeZone: data.timezone,
          hour: 'numeric',
          hour12: true,
        }),
        temperature: Math.round(hour.temp),
        weatherStatus: hour.weather[0].description,
        weatherIcon: hour.weather[0].icon,
      })),
      dailyForecast: data.daily.map((day) => ({
        dayOfWeek: new Date(day.dt * 1000).toLocaleDateString('en-US', {
          weekday: 'long',
          timeZone: data.timezone,
        }),
        weatherStatus: day.weather[0].description,
        weatherIcon: day.weather[0].icon,
        summary: day.summary,
        high: Math.round(day.temp.max),
        low: Math.round(day.temp.min),
      })),
      uvIndex: Math.round(data.current.uvi),
      sunriseTime: new Date(data.current.sunrise * 1000).toLocaleTimeString('en-US', {
        timeZone: data.timezone,
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      }),
      sunsetTime: new Date(data.current.sunset * 1000).toLocaleTimeString('en-US', {
        timeZone: data.timezone,
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      }),
      windData: {
        speed: data.current.wind_speed,
        direction: data.current.wind_deg,
      },
      feelsLike: Math.round(data.current.feels_like),
      precipitation: data.hourly.reduce(
        (sum, hour) => sum + (hour.rain ? hour.rain['1h'] : 0),
        0,
      ),
      humidity: data.current.humidity,
      dew_point: data.current.dew_point,
      visibility: data.current.visibility,
      currentStatusId: data.current.weather[0].id,
      currentStatus: data.current.weather[0].main,
      currentStatusIcon: data.current.weather[0].icon
    };
  }
}
