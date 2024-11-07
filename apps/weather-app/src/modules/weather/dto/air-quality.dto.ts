import { ApiProperty } from '@nestjs/swagger';

class CoordDto {
  @ApiProperty({ example: 42.3314, description: 'Latitude of the location' })
  lat: number;

  @ApiProperty({ example: -83.0458, description: 'Longitude of the location' })
  lon: number;
}

export class AirQualityDto {
  @ApiProperty({
    description: 'Coordinates of the location',
    type: CoordDto,
    example: { lat: 42.3314, lon: -83.0458 },
  })
  coord: CoordDto;

  @ApiProperty({ example: 3, description: 'Air quality index (AQI) of the location' })
  aqi: number;
}
