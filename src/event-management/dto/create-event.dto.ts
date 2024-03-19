import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'BTS Concert' })
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'jakarta' })
  city: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ example: 120 })
  price: number;
}
