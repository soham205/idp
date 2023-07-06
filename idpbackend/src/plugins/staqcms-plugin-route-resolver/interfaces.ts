import { NextFunction, Request, Response } from "express";

type METHOD_TYPE_T = "get" | "put" | "post" | "delete" | "patch";

export type AsyncFunction = (
  req: Request,
  res: Response,
  Next: NextFunction
) => Promise<void>;

export interface IRouterElement {
  path: string;
  pathCallback: AsyncFunction;
  method: METHOD_TYPE_T[];
}
