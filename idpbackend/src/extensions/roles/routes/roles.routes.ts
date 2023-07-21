import { UserRole } from '../../../plugins/staqcms-plugin-user-role/index';

// UserRole.getRoleRouteTable()

import { IProtectedRouterElement } from '../../../plugins/staqcms-plugin-route-resolver/interfaces';
import RolesServices from '../services/roles.services';
import { IRoleBaseService } from '../../../plugins/staqcms-plugin-user-role/interfaces/roleInterfaces';

const vCardRoutes: IProtectedRouterElement[] = [
	...(UserRole.getRoleRouteTable(RolesServices as unknown as IRoleBaseService) as unknown as IProtectedRouterElement[])
];

export default vCardRoutes;
