import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';
import { ValidateOptional } from '../validators';

export class PaginationQueryDto {
  @ValidateOptional()
  @Min(1)
  @Max(100)
  @IsInt()
  @Type(() => Number)
  @ApiProperty({
    description: 'Maximum items can be fetched in a request',
    maximum: 100,
    minimum: 1,
    default: 10,
    required: false,
  })
  limit?: number = 10;

  @ValidateOptional()
  @Type(() => Number)
  @ApiProperty({
    description: 'The offset of the item at which to begin the response',
    maximum: 99,
    minimum: 0,
    default: 0,
    required: false,
  })
  offset?: number = 0;
}
