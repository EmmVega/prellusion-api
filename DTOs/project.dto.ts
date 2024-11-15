import { Type } from "class-transformer";
import { IsNumber, IsString } from "class-validator";

export class ProjectDto {
   @Type(() => Number)
   public userId: number;

   @IsString()
   public name: string;

   @IsString()
   public draft: string;
   
   @Type(() => Number)
   public fileId: number;
}
