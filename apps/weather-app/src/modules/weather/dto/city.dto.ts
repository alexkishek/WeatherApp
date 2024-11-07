import { ApiProperty } from '@nestjs/swagger';

export class CityDto {
  @ApiProperty({ example: 'Detroit', description: 'Name of the city' })
  name: string;

  @ApiProperty({ example: 'Michigan', description: 'State of the city (optional)', required: false })
  state?: string;

  @ApiProperty({ example: 'US', description: 'Country code of the city' })
  country: string;

  @ApiProperty({ example: 42.3314, description: 'Latitude of the city' })
  lat: number;

  @ApiProperty({ example: -83.0458, description: 'Longitude of the city' })
  lon: number;
}
