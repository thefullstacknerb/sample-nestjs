import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateAlbumRequestBodyDto {
  @Min(1)
  @IsInt()
  @Type(() => Number)
  ArtistId: number;

  @IsNotEmpty()
  @IsString()
  @Type(() => String)
  Title: string;
}
