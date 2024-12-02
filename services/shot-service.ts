import { db } from "../models/index.js";
import { CRUDService } from "./CRUD-service.js";

export const shotService = new CRUDService('Shot', db.Shot, 'Scene', db.Scene);