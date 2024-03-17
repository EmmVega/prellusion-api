import { Middleware, ExpressMiddlewareInterface } from "routing-controllers";

@Middleware({ type: "before" })
export class LoggingMiddleware implements ExpressMiddlewareInterface {
   use(request: any, response: any, next: (err: any) => any): void {
      console.log("do something...");
      next("error");
   }
}

@Middleware({ type: "before" })
export class CorsMiddleware implements ExpressMiddlewareInterface {
   use(req: any, res: any, next: (err?: any) => any): void {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader(
         "Access-Control-Allow-Headers",
         "Origin, X-Requested-With, Content-Type, ResponseType, Accept, Authorization"
      );
      res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
      // console.log("pasa por aqui!!");
      next();
   }
}

// export function corsMiddleware(
//    req: any,
//    res: any,
//    next?: (err?: any) => any
// ): any {
//    console.log("pasa por aqui?");
//    res.setHeader("Access-Control-Allow-Origin", "*");
//    res.setHeader(
//       "Access-Control-Allow-Headers",
//       "Origin, X-Requested-With, Content-Type, ResponseType, Accept, Authorization"
//    );
//    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
//    next();
// }
