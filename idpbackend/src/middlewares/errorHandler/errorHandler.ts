import { Express, Request, Response, NextFunction } from "express";

import { ENVIRONMENT, ENVIRONMENTS } from "../../config";
import {
  ApiError,
  InternalError,
  NotFoundError,
} from "../../core/APIHandler/APIError";

const errorHanlder = {
  notFoundErrorHanlder: (app: Express) => {
    app.use((req: Request, res: Response, next: NextFunction) => {
      return next(new NotFoundError());
    });
  },

  internalErrorHanlder: (app: Express) => {
    // Middleware Error Handler
    app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
      if (err instanceof ApiError) {
        ApiError.handle(err, res);
      } else {
        if (ENVIRONMENT === ENVIRONMENTS.DEVELOP) {
          console.error(err);
          return res.status(500).send(err.message);
        }
        ApiError.handle(new InternalError(), res);
      }
    });
  },
};

export { errorHanlder };
