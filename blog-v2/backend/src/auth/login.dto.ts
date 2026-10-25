import { IsString, Length, Matches } from 'class-validator';

export class LoginDto {
  @IsString() @Length(1, 100) @Matches(/^[a-zA-Z0-9._-]+$/)
  username!: string;

  @IsString() @Length(1, 1024)
  password!: string;
}
