// const permissionController = require('../../permission/controllers/permission.controllers');
import { IInitPermissionServiceProps } from "../../../interfaces/index";
import { permissionController } from "../controllers/permission.controllers";

const permissionRoute = [
  {
    path: `/`,
    method: ["get"],
    pathCallback: permissionController.find,
  },
  {
    path: `/:id`,
    method: ["get"],
    pathCallback: permissionController.findOne,
  },
  {
    path: `/updatePermissions`,
    method: ["put"],
    pathCallback: permissionController.updatePermissions,
  },
  {
    path: `/:id`,
    method: ["put"],
    pathCallback: permissionController.update,
  },
  {
    path: `/`,
    method: ["delete"],
    pathCallback: permissionController.deleteAll,
  },
  {
    path: `/:id`,
    method: ["delete"],
    pathCallback: permissionController.delete,
  },
];

export const permissionRoutes = (Permission: IInitPermissionServiceProps) => {
  permissionController.init(Permission);
  return permissionRoute;
};
