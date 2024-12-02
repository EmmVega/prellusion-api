import { Type } from "class-transformer";
import {
   IsNumber,
   IsBoolean,
   IsEnum,
   IsArray,
   ValidateNested
} from "class-validator";
import { Times } from "../enums/Times.js";
import { Spaces } from "../enums/Spaces.js";

export class SceneDto {
   @Type(() => Number)
   @IsNumber()
   public id: number;

   @Type(() => Number)
   @IsNumber()
   public projectId: number;

   @Type(() => Number)
   @IsNumber()
   public number: number;

   @Type(() => String)
   @IsEnum(Spaces, {
      message: `Invalid spaces. Valid Spaces are: ${Object.values(Spaces).join(
         ", "
      )}`,
   })
   public space: string;

   @Type(() => String)
   public place: string;

   @Type(() => String)
   @IsEnum(Times, {
      message: `Invalid time. Valid Times are: ${Object.values(Times).join(
         ", "
      )}`,
   })
   public time: string;

   @Type(() => String)
   public description: string;

   @IsBoolean()
   public dialogue: boolean;

   @Type(() => Number)
   @IsNumber()
   public script: number;

   @IsArray()
   @ValidateNested({ each: true }) // Validate each element in the array
   @Type(() => Number) // Transform each element into a number
   public talent: number[];
}
