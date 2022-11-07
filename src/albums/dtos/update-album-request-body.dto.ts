import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';
import { ValidateOptional } from 'src/shared/validators';

export class UpdateAlbumRequestBodyDto {
  @ValidateOptional()
  @ApiProperty()
  @Min(1)
  @IsInt()
  @Type(() => Number)
  ArtistId?: number;

  @ValidateOptional()
  @IsNotEmpty()
  @IsString()
  @Type(() => String)
  Title?: string;
}
