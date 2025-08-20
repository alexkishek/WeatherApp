export interface OpenWeatherResponse {
  lat: number;
  lon: number;
  timezone: string;
  timezone_offset: number;
  current: CurrentWeather;
  minutely?: MinutelyWeather[];
  hourly: HourlyWeather[];
  daily: DailyWeather[];
  alerts?: WeatherAlert[];
}

export interface CurrentWeather {
  dt: number;
  sunrise: number;
  sunset: number;
  temp: number;
  feels_like: number;
  pressure: number;
  humidity: number;
  dew_point: number;
  uvi: number;
  clouds: number;
  visibility: number;
  wind_speed: number;
  wind_deg: number;
  wind_gust?: number;
  weather: WeatherCondition[];
  rain?: {
    '1h': number;
  };
  snow?: {
    '1h': number;
  };
}

export interface HourlyWeather {
  dt: number;
  temp: number;
  feels_like: number;
  pressure: number;
  humidity: number;
  dew_point: number;
  uvi: number;
  clouds: number;
  visibility: number;
  wind_speed: number;
  wind_deg: number;
  wind_gust?: number;
  weather: WeatherCondition[];
  pop: number;
  rain?: {
    '1h': number;
  };
  snow?: {
    '1h': number;
  };
}

export interface DailyWeather {
  dt: number;
  sunrise: number;
  sunset: number;
  moonrise: number;
  moonset: number;
  moon_phase: number;
  summary: string;
  temp: {
    day: number;
    min: number;
    max: number;
    night: number;
    eve: number;
    morn: number;
  };
  feels_like: {
    day: number;
    night: number;
    eve: number;
    morn: number;
  };
  pressure: number;
  humidity: number;
  dew_point: number;
  wind_speed: number;
  wind_deg: number;
  wind_gust?: number;
  weather: WeatherCondition[];
  clouds: number;
  pop: number;
  rain?: number;
  snow?: number;
  uvi: number;
}

export interface WeatherCondition {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface MinutelyWeather {
  dt: number;
  precipitation: number;
}

export interface WeatherAlert {
  sender_name: string;
  event: string;
  start: number;
  end: number;
  description: string;
  tags: string[];
}

export interface TransformedWeatherData {
  temperature: number;
  high: number;
  low: number;
  hourlyBreakdown: TransformedHourlyData[];
  dailyForecast: TransformedDailyData[];
  uvIndex: number;
  sunriseTime: string;
  sunsetTime: string;
  windData: {
    speed: number;
    direction: number;
  };
  feelsLike: number;
  precipitation: number;
  humidity: number;
  dew_point: number;
  visibility: number;
  currentStatusId: number;
  currentStatus: string;
  currentStatusIcon: string;
}

export interface TransformedHourlyData {
  time: string;
  temperature: number;
  weatherStatus: string;
  weatherIcon: string;
}

export interface TransformedDailyData {
  dayOfWeek: string;
  weatherStatus: string;
  weatherIcon: string;
  summary: string;
  high: number;
  low: number;
}