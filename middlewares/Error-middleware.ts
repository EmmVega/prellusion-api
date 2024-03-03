import { ValidationError } from "class-validator";
import {
   Middleware,
   ExpressErrorMiddlewareInterface,
   BadRequestError,
   HttpError,
} from "routing-controllers";

@Middleware({ type: "after" })
export class GlobalErrorHandler implements ExpressErrorMiddlewareInterface {
   error(error: any, request: any, response: any, next: (err?: any) => any) {
      if (response.headersSent) {
         return next(error);
      }

      if (error instanceof BadRequestError) {
         response.status(error.httpCode).json({
            name: error.name,
            message: error.message,
            errors: error["errors"] || [],
         });
      } else if (error instanceof HttpError) {
         response.status(error.httpCode).json({
            status: error.httpCode,
            message: error.message,
         });
      } else {
         response.status(error.status).json({
            name: "InternalServerError",
            message: "Internal Server Error",
         });
      }
   }
}
