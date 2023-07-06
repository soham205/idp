import { Request } from "express";

declare interface IDRequest extends Request {
    id?: string;
}