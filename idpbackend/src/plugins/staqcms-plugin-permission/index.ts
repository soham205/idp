import { permissionRoute } from "./router";
import { IInitPermissionServiceProps } from "./interfaces";
import { PermissionSchema } from "./modules/permission/models/permission";

export const permission = {
  getPermissionRouteTable: (Permission: IInitPermissionServiceProps) => {
    return permissionRoute.getPermissionRoute(Permission);
  },

  getPermissionSchema: () => {
    return PermissionSchema;
  },
};
