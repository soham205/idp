import { permission } from '../../../plugins/staqcms-plugin-permission';

import { IRouterElement } from '../../../plugins/staqcms-plugin-route-resolver/interfaces';
import RolesServices from '../services/permissions.services';
import { IRoleBaseService } from '../../../plugins/staqcms-plugin-user-role/interfaces/roleInterfaces';

const vCardRoutes: IRouterElement[] = [
	...(permission.getPermissionRouteTable(RolesServices as unknown as IRoleBaseService) as IRouterElement[])
];

export default vCardRoutes;
