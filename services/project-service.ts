import { HttpError } from "routing-controllers";
import { ProjectDto } from "../DTOs/project.dto.js";
import { db } from "../models/index.js";
import * as fs from "fs";
import * as path from "path";
import PdfParse from "pdf-parse/lib/pdf-parse.js";
import OpenAI from "openai";
import { CRUDService } from "./CRUD-service.js";

import { publishMessage } from "./pubsub-service.js";

class ProjectService extends CRUDService<typeof db.Project> {
   constructor() {
      // Call the constructor of CRUDService with appropriate values for Project
      super('Project', db.Project, 'User', db.User);  // 'User' and 'User' are just examples for your parent entity
   }
   public openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
   public async createProject(project: ProjectDto, file: any) {
      const newProject = await db.Project.create(project);
      const projectId = newProject.dataValues.id;
      const filePath = file.path;

      try {
         await publishMessage('script-processing', { projectId, filePath });
         return newProject.dataValues;
      } catch (error) {
         // If publishing the message fails, we must delete the created project
         // to avoid leaving the system in an inconsistent state.
         await db.Project.destroy({ where: { id: projectId } });
         console.error("Failed to publish script processing message. Rolled back project creation.", error);
         // Re-throw a more specific error to the controller
         throw new Error("Failed to initiate script processing after project creation.");
      }
   }

   public async getProjectById(id: number) {
      const project = await db.Project.findByPk(id);
      if (!project) {
         throw new HttpError(404, "Project not found");
      }
      const projectDataValues = project.get();
      return projectDataValues;
   }

   public async getAllProjects() {
      const projects = await db.Project.findAll();
      const projectsDataValues = projects.map((project) => project.get());
      return projectsDataValues;
   }

   public async scriptParser() {
      const pdfPath = path.join(
         __dirname,
         "../uploads/2d767c8f-3231-4c2c-9657-7e986b682027.pdf"
      ); // Replace with the actual path to your PDF file

      try {
         // Read the PDF file
         const pdfContent = await PdfParse(fs.readFileSync(pdfPath)).then(
            (data) => {
               return data;
               // console.log("data: ", data.text);
            }
         );

         // console.log("PDF CONTENT: ", pdfContent);
         // return;

         // we define the propm
         // const prompt = `
         //  You are a filmmaker assistant. You have been asked to create a scene list for a script.
         //  Use this script: ${pdfContent.text} obtained with pdf-parse package.
         //  1. Identify all scenes in the script.
         //  3. create an array of scenes with 7 keys:
         //  scene number,
         //  space (extract this from scene heading with the next format 'int/ext - place - time'),
         //  place (extract this from scene heading with the next format 'int/ext - place - time'),
         //  time (extract this from scene heading with the next format 'int/ext - place - time'),
         //  description (extract this from action).
         //  Dialogue (true if there is dialogue, false if there is not).
         //  script (the number of sheet the scene starts on).

         //  4. Return that array of scenes in JSON format.
         //  `;

         // // Parse the content using GPT
         const scriptJson = await this.getCompletion(pdfContent.text);
         const scriptTitle = await JSON.parse(scriptJson).data.title;
         fs.writeFileSync(
            `./uploads/${scriptTitle.replace(/\s/g, "")}.json`,
            scriptJson
         );
         // return scenes;
      } catch (e) {
         console.log("ERROR: ", e);
         throw e;
      }
   }

   public async getCompletion(
      pdfContent: string,
      model = "gpt-3.5-turbo",
      temperature = 0.2
   ) {
      try {
         // Call the OpenAI API to generate completions
         const response = await this.openai.chat.completions.create({
            model: model,
            // messages: [{ role: "user", content: prompt }],
            messages: [
               {
                  role: "system",
                  content: `You are a filmmaker assistant. 
                 You have experience in creating scene lists for shooting lists.
                `,
               },
               {
                  role: "user",
                  content: `
                  You have been be asked to analyzed a script obtained with pdf-parse package. 
                  This is the pdf content: ${pdfContent}

                 1. Identify all scenes in the script. Starting from page 2. Each scene has a heading with format "INT/EXT - place - time"
                 2. Create an array of scenes objects with 7 keys: 
                   scene number, 
                   space (extract this from scene heading with the next format 'INT/EXT - place - time'), 
                   place (extract this from scene heading with the next format 'INT/EXT - place - time'),
                   time (extract this from scene heading with the next format 'INT/EXT - place - time'),
                   description (extract this from action).
                   Dialogue (true if there is dialogue, false if there is not), 
                   script 
                 (the number of sheet the scene starts on, it is always marked in the sheet heading and has this format: number.\n). 
                 3. Add a second object (at the same level of scenes key) 
                 with general data from the first page of the script.
                 This object should have the following keys:
                 title, writter, draft and pages (number of total pages without counting cover page).
                 This object should be named as data.
                 
                 4. Make sure to have had analyzed all the pages of the script. 
                 The number of items in the scenes array should match the number of scene headings with format "INT/EXT - place - time" in the script.
                  `,
               },
               {
                  role: "system",
                  content: `
                  Once you have the array of scenes and the data object, it should have the next JSON structure:
                  {
                     "scenes": [
                        {
                        "scene number": 1,
                        "space": "EXT",
                        "place": "CALLE",
                        "time": "AFTERNOON",
                        "description": "Perla y Tadeo conversando sobre la situación de su padre.",
                        "Dialogue": true,
                        "script": "2"
                        },
                        {
                        "scene number": 2,
                        "space": "INT",
                        "place": "CASA",
                        "time": "NIGHT",
                        "description": "Perla y Tadeo conversando sobre la situación de su padre.",
                        "Dialogue": true,
                        "script": "2"
                        }
                     ],
                     "data": {
                        "title": "Mi título",
                        "writter": "Mi escritor",
                        "draft": "Mi draft",
                        "pages": 90
                     }
                  }
                  Return only a JSON object with the scenes and data keys.
                 `,
               },
            ],
            temperature: temperature,
         });

         return response.choices[0].message.content;
      } catch (error) {
         // Handle errors
         console.error("getCompletion Error:", error);
         throw error;
      }
   }

   public async getProjectShots(projectId: number) {
      const projectWithShots = await db.Project.findOne({
         where: {
            id: projectId,
         },
         include: {
            model: db.Scene,
            include: {
               model: db.Shot,
            }
         }
      });

      if (!projectWithShots) {
         throw new Error(`Project with ID ${projectId} not found`);
      }

      const shots = projectWithShots.Scenes.flatMap(scene => scene.Shots) || [];
      return shots;
   }

   public async deleteProjectsByIds(itemIds: number[]): Promise<any[]> {
      const deletePromises = itemIds.map(async (itemId) => {
         const item = await db.Project.findByPk(itemId)
         if (!item) {
            throw new HttpError(404, `${this.entityName} not found`)
         }
         await db.Project.destroy({
            where: { id: itemId }
         })
      })
      await Promise.all(deletePromises);
      const remainingItems = await db.Project.findAll()
      return remainingItems;
   }

}

export default ProjectService;
