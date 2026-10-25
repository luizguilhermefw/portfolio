import { IsOptional, IsString, IsUUID, IsUrl, Length, Matches, MaxLength, ValidateIf } from 'class-validator';

export class CreatePostDto {
  @IsString() @Length(1, 200) @Matches(/\S/)
  title!: string;

  @IsString() @Length(1, 200) @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  slug!: string;

  @IsString() @Length(1, 200000) @Matches(/\S/)
  contentHtml!: string;

  @IsOptional() @IsString() @MaxLength(1000)
  excerpt?: string | null;

  @IsOptional() @IsUUID()
  categoryId?: string | null;

  @IsOptional() @IsString() @MaxLength(2048) @IsUrl({ protocols: ['https', 'http'], require_protocol: true })
  imageUrl?: string | null;

  @IsOptional() @IsString() @MaxLength(320)
  metaDescription?: string | null;
}

export class UpdatePostDto {
  @ValidateIf((_object, value) => value !== undefined) @IsString() @Length(1, 200) @Matches(/\S/)
  title?: string;

  @ValidateIf((_object, value) => value !== undefined) @IsString() @Length(1, 200) @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  slug?: string;

  @ValidateIf((_object, value) => value !== undefined) @IsString() @Length(1, 200000) @Matches(/\S/)
  contentHtml?: string;

  @IsOptional() @IsString() @MaxLength(1000)
  excerpt?: string | null;

  @IsOptional() @IsUUID()
  categoryId?: string | null;

  @IsOptional() @IsString() @MaxLength(2048) @IsUrl({ protocols: ['https', 'http'], require_protocol: true })
  imageUrl?: string | null;

  @IsOptional() @IsString() @MaxLength(320)
  metaDescription?: string | null;
}
