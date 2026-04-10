import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateHotspotDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsNumber()
  pos_x: number; // Ví dụ: 45.5 (%)

  @IsNumber()
  pos_y: number; // Ví dụ: 80.0 (%)

  @IsString()
  @IsOptional()
  type?: string;

  @IsNumber()
  screenId: number; // Màn hình vừa tạo có ID là 1 đúng không?
}
