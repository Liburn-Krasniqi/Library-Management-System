import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ReadingStatus } from 'generated/prisma/enums';

export class CreateBookDto {
  @IsString()
  title: string;

  @IsString()
  author: string;

  @IsOptional()
  @IsString()
  genre?: string;

  @IsEnum(ReadingStatus)
  readingStatus: ReadingStatus;
}
