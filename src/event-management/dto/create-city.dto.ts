import { IsNotEmpty, IsString } from 'class-validator';
import { IsValidCountry } from '../validator/country.validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCityDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'jakarta' })
  cityName: string;

  @IsValidCountry()
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'indonesia' })
  countryName: string;
}
