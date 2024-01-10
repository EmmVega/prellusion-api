import { Type } from "class-transformer";
import { IsNumber, IsString, IsBoolean } from "class-validator";

export class SceneDto {
  @Type(() => Number)
  @IsNumber()
  public number: number;

  @Type(() => Number)
  @IsNumber()
  public shotNumber: number;

  @IsString()
  public shot: string;

  @IsString()
  public movement: string;

  @IsString()
  public angulation: string;

  @IsString()
  public action: string;

  @IsBoolean()
  public dialogue: boolean;

  @IsBoolean()
  public sound: boolean;

  @IsString()
  public transition: string;

  @IsString()
  public notes: string;

  @Type(() => Number)
  @IsNumber()
  public script: number;
}
