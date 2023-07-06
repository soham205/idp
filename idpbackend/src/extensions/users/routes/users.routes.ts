import { UserRole } from '../../../plugins/staqcms-plugin-user-role';

import { IRouterElement } from '../../../plugins/staqcms-plugin-route-resolver/interfaces';
import UserServices from '../services/users.services';
import { IInitUserServiceProps } from '../../../plugins/staqcms-plugin-user-role/interfaces/userinterface';

const usersRoutes: IRouterElement[] = [
	...(UserRole.getUserRouteTable(UserServices as unknown as IInitUserServiceProps) as IRouterElement[])
];

export default usersRoutes;
