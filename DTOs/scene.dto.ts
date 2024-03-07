import { Type } from "class-transformer";
import { IsNumber, IsString, IsBoolean, IsIn, IsEnum } from "class-validator";
import { Shots } from "../enums/Shots";
import { Movements } from "../enums/Movements";
import { Angulations } from "../enums/Angulations";
import { Transitions } from "../enums/Transitions";

export class SceneDto {
   @Type(() => Number)
   @IsNumber()
   public number: number;

   @Type(() => Number)
   @IsNumber()
   public shotNumber: number;

   @IsString()
   @IsEnum(Shots, {
      message: `Invalid shot. Valid shots are: ${Object.values(Shots).join(
         ", "
      )}`,
   })
   public shot: string;

   @IsString()
   @IsEnum(Object.values(Movements), {
      message: `Invalid movement. Valid movements are: ${Object.values(
         Movements
      ).join(", ")}`,
   })
   public movement: string;

   @IsString()
   @IsEnum(Object.values(Angulations), {
      message: `Invalid angulation. Valid Angulations are: ${Object.values(
         Angulations
      ).join(", ")}`,
   })
   public angulation: string;

   @IsString()
   public action: string;

   @IsBoolean()
   public dialogue: boolean;

   @IsBoolean()
   public sound: boolean;

   @IsString()
   @IsEnum(Object.values(Transitions), {
      message: `Invalid transition. Valid transitions are: ${Object.values(
         Transitions
      ).join(", ")}`,
   })
   public transition: string;

   @IsString()
   public notes: string;

   @Type(() => Number)
   @IsNumber()
   public script: number;
}
