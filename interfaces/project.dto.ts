import { Type } from "class-transformer";
import { IsNumber, IsString } from "class-validator";

export class Project {
   @Type(() => Number)
   @IsNumber()
   public id: number;

   @IsString()
   public userId: string;

   @IsString()
   public name: string;

   @IsString()
   public notes: string;
}
