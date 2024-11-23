import { db } from "../models";
import { CRUDService } from "./CRUD-service";

export const shotService = new CRUDService('Shot', db.Shot, 'Scene', db.Scene);