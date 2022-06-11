import { IsNotEmpty, IsString } from "class-validator";

export class TrackerDto {
  @IsString()
  @IsNotEmpty()
  description: string;
}