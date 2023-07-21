import { permission } from '../../../plugins/staqcms-plugin-permission';

import { IProtectedRouterElement } from '../../../plugins/staqcms-plugin-route-resolver/interfaces';
import PermissionServices from '../services/permissions.services';
import { IRoleBaseService } from '../../../plugins/staqcms-plugin-user-role/interfaces/roleInterfaces';

function addAuthStratergy():IProtectedRouterElement[]{
  const routes:IProtectedRouterElement[] = [];

  return []
}
const vCardRoutes: IProtectedRouterElement[] = [
	...(permission.getPermissionRouteTable(PermissionServices as unknown as IRoleBaseService) as unknown as  IProtectedRouterElement[])
];

export default vCardRoutes;
