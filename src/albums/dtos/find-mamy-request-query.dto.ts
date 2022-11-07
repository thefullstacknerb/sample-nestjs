import { PaginationQueryDto } from 'src/shared/dtos';
import { IsInt, Min } from 'class-validator';
import { ValidateOptional } from 'src/shared/validators';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class FindManyAlbumsRequestQueryDto extends PaginationQueryDto {
  @ApiProperty({ description: 'Search Album by ArtistId', required: false })
  @ValidateOptional()
  @Min(1)
  @IsInt()
  @Type(() => Number)
  artistId?: number;
}
