import { IsString, IsNotEmpty, IsOptional, IsUrl } from 'class-validator';

export class CreateAppDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsUrl()
  @IsOptional()
  logo_url?: string;
}
