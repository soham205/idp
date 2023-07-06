import { roleRoutes } from "./modules/role/routes/role.routes";
import { userRoutes } from "./modules/user/routes/user.routes";
import { IRoleBaseService } from "./interfaces/roleInterfaces";
import { IInitUserServiceProps } from "./interfaces/userinterface";

export const userRoleRoutes = {
  getUserRoute: (User: IInitUserServiceProps) => {
    return userRoutes(User);
  },
  getRoleRoute: (Role: IRoleBaseService) => {
    return roleRoutes(Role);
  },
};
