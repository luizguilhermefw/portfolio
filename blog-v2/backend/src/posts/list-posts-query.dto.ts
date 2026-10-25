import { Transform } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Matches, Max, MaxLength, Min } from 'class-validator';
import { PostStatus } from '../generated/prisma/enums.js';

const numericQuery = ({ value }: { value: unknown }) =>
  typeof value === 'string' && /^[0-9]+$/.test(value) ? Number(value) : value;

export class PaginationQueryDto {
  @Transform(numericQuery) @IsInt() @Min(1) @Max(100000)
  page = 1;

  @Transform(numericQuery) @IsInt() @Min(1) @Max(100)
  limit = 10;

  @IsOptional() @IsString() @MaxLength(200)
  search?: string;
}
export class ListPostsQueryDto extends PaginationQueryDto {
  @IsOptional() @IsString() @MaxLength(200) @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  category?: string;
}
export class AdminListPostsQueryDto extends PaginationQueryDto {
  @IsOptional() @IsEnum(PostStatus)
  status?: PostStatus;
}
