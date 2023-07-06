import { UserRole } from '../../../plugins/staqcms-plugin-user-role/index';

// UserRole.getRoleRouteTable()

import { IRouterElement } from '../../../plugins/staqcms-plugin-route-resolver/interfaces';
import RolesServices from '../services/roles.services';
import { IRoleBaseService } from '../../../plugins/staqcms-plugin-user-role/interfaces/roleInterfaces';

const vCardRoutes: IRouterElement[] = [
	...(UserRole.getRoleRouteTable(RolesServices as unknown as IRoleBaseService) as IRouterElement[])
];

export default vCardRoutes;
