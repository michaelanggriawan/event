import { ApiProperty } from '@nestjs/swagger';

class Event {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'BTS Concert' })
  name: string;

  @ApiProperty({ example: 120 })
  price: number;
}

class City {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'jakarta' })
  cityName: string;

  @ApiProperty({ example: 'indonesia' })
  countryName: string;

  @ApiProperty({ type: [Event] })
  events: Event[];
}

export class CityResponse {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ type: City })
  city: City;
}

export class CityResponseCreated {
  @ApiProperty({ example: 201 })
  statusCode: number;

  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ type: City })
  city: City;
}
