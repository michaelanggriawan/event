import { ApiProperty } from '@nestjs/swagger';

class City {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'jakarta' })
  cityName: string;

  @ApiProperty({ example: 'indonesia' })
  countryName: string;
}

class Event {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'BTS Concert' })
  name: string;

  @ApiProperty({ example: 120 })
  price: number;

  @ApiProperty({ type: City })
  city: City;
}

export class EventsResponse {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ type: [Event] })
  data: Event[];
}

export class EventResponse {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ type: Event })
  data: Event;
}

export class EventResponseCreated {
  @ApiProperty({ example: 201 })
  statusCode: number;

  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ type: Event })
  data: Event;
}
