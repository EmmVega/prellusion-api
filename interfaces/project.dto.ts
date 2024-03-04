import { Type } from "class-transformer";
import { IsNumber, IsString } from "class-validator";

export class ProjectDto {
   @Type(() => Number)
   public userId: number;

   @IsString()
   public name: string;

   @IsString()
   public notes: string;

   @Type(() => Number)
   public sceneIds: number[];
}
