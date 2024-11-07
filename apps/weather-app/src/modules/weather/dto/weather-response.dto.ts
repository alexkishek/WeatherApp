import { ApiProperty } from '@nestjs/swagger';

export class WeatherResponseDto {
  @ApiProperty({ example: 72, description: 'Current temperature in Fahrenheit' })
  temperature: number;

  @ApiProperty({ example: 75, description: 'High temperature for the day in Fahrenheit' })
  high: number;

  @ApiProperty({ example: 65, description: 'Low temperature for the day in Fahrenheit' })
  low: number;

  @ApiProperty({
    description: 'Hourly weather data breakdown',
    type: Array,
    example: [
      { time: '9 AM', temperature: 70, weatherStatus: 'clear sky', weatherIcon: '01d' },
      { time: '10 AM', temperature: 72, weatherStatus: 'partly cloudy', weatherIcon: '02d' },
    ],
  })
  hourlyBreakdown: Array<{
    time: string;
    temperature: number;
    weatherStatus: string;
    weatherIcon: string;
  }>;

  @ApiProperty({
    description: '7-day weather forecast',
    example: [
      {
        dayOfWeek: 'Monday',
        weatherStatus: 'few clouds',
        summary: 'Partly cloudy throughout the day',
        weatherIcon: '02d',
        high: 75,
        low: 65,
      },
      {
        dayOfWeek: 'Tuesday',
        weatherStatus: 'scattered clouds',
        summary: 'Clouds clearing later in the day',
        weatherIcon: '03d',
        high: 77,
        low: 66,
      },
    ],
  })
  dailyForecast: Array<{
    dayOfWeek: string;
    weatherStatus: string;
    summary: string;
    weatherIcon: string;
    high: number;
    low: number;
  }>;

  @ApiProperty({ example: 5, description: 'UV index for the day' })
  uvIndex: number;

  @ApiProperty({ example: '6:45 AM', description: 'Time of sunrise' })
  sunriseTime: string;

  @ApiProperty({ example: '7:45 PM', description: 'Time of sunset' })
  sunsetTime: string;

  @ApiProperty({
    description: 'Wind data including speed and direction',
    example: { speed: 10, direction: 180 },
  })
  windData: {
    speed: number;
    direction: number;
  };

  @ApiProperty({ example: 72, description: 'Feels-like temperature in Fahrenheit' })
  feelsLike: number;

  @ApiProperty({ example: 0, description: 'Precipitation in inches' })
  precipitation: number;

  @ApiProperty({ example: 50, description: 'Humidity percentage' })
  humidity: number;

  @ApiProperty({ example: 50, description: 'Dew point temperature in Fahrenheit' })
  dew_point: number;

  @ApiProperty({ example: 10000, description: 'Visibility in meters' })
  visibility: number;

  @ApiProperty({ example: 801, description: 'ID of the current weather condition' })
  currentStatusId: number;

  @ApiProperty({ example: 'Few clouds', description: 'Description of the current weather condition' })
  currentStatus: string;

  @ApiProperty({ example: '02d', description: 'Icon code representing the current weather' })
  currentStatusIcon: string;
}
