import { userRoleRoutes } from "./router";
import { UserSchema } from "./modules/user/models/User";
import { RolesSchema } from "./modules/role/models/Role";
import { IRoleBaseService } from "./interfaces/roleInterfaces";
import { IInitUserServiceProps } from "./interfaces/userinterface";


export const UserRole = {
  getUserRouteTable: (User: IInitUserServiceProps) => {
    return userRoleRoutes.getUserRoute(User);
  },

  getRoleRouteTable: (Role: IRoleBaseService) => {
    return userRoleRoutes.getRoleRoute(Role);
  },

  getUserSchema: () => {
    return UserSchema;
  },

  getRoleSchema: () => {
    return RolesSchema;
  },
};
