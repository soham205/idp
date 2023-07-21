import { UserRole } from '../../../plugins/staqcms-plugin-user-role';

import { IProtectedRouterElement } from '../../../plugins/staqcms-plugin-route-resolver/interfaces';
import UserServices from '../services/users.services';
import { IInitUserServiceProps } from '../../../plugins/staqcms-plugin-user-role/interfaces/userinterface';

const usersRoutes: IProtectedRouterElement[] = [
	...(UserRole.getUserRouteTable(UserServices as unknown as IInitUserServiceProps) as unknown as IProtectedRouterElement[])
];

export default usersRoutes;
