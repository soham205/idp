import { Router } from "express";

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace RouterModule {
    export interface IRouteEntry {
        routePath: string
        router: Router
    }
}