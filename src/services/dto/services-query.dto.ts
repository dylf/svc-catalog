import { IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from './pagination-query.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class ServicesQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    name: 'search',
    type: String,
    description: 'Search terms',
  })
  search?: string;
}
