import { Type } from "class-transformer";
import { IsNumber, IsString } from "class-validator";

export class ProjectDto {
   @IsString()
   public name: string;

   @IsString()
   public draft: string;
   
   @Type(() => Number)
   public fileId: string;
}
