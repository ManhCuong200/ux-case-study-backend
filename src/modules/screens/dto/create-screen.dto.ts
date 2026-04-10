import { IsString, IsNotEmpty, IsNumber, IsUrl } from 'class-validator';

export class CreateScreenDto {
  @IsString()
  @IsNotEmpty()
  name: string; // Trang chủ, Giỏ hàng...

  @IsUrl()
  @IsNotEmpty()
  image_url: string; // Link ảnh mockup từ Figma/Cloudinary

  @IsNumber()
  @IsNotEmpty()
  appId: number; // ID của App Shopee bạn vừa tạo (ví dụ: 1)
}
