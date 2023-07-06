// const permissionRoute = require("./modules/permission/routes/permission.routes");
import { IInitPermissionServiceProps } from "./interfaces";
import { permissionRoutes } from "./modules/permission/routes/permission.routes";
export const permissionRoute = {
  getPermissionRoute: (Permission: IInitPermissionServiceProps) => {
    return permissionRoutes(Permission);
  },
};
