import { IsNotEmpty, IsString } from 'class-validator';
import { IsValidCountry } from '../validator/country.validator';

export class CreateCityDto {
  @IsNotEmpty()
  @IsString()
  cityName: string;

  @IsValidCountry()
  @IsNotEmpty()
  @IsString()
  countryName: string;
}
