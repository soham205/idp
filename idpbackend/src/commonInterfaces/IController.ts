import { Request, Response } from "express";

interface IBaseController {
  create: (req: Request, res: Response) => Promise<void>;
  findAll: (req: Request, res: Response) => Promise<void>;
  findOne: (req: Request, res: Response) => Promise<void>;
  update: (req: Request, res: Response) => Promise<void>;
  deleteOne: (req: Request, res: Response) => Promise<void>;
  deleteAll: (req: Request, res: Response) => Promise<void>;
}

export { IBaseController };
