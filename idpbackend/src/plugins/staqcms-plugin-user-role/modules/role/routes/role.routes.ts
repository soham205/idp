import { rolesController } from '../controllers/role.controllers';
import { IRoleBaseService } from '../../../interfaces/roleInterfaces';

const roleRoute = [
	{
		path: `/`,
		method: ['get'],
		pathCallback: rolesController.find
	},
	{
		path: `/:id`,
		method: ['get'],
		pathCallback: rolesController.findOne
	},
	{
		path: `/`,
		method: ['post'],
		pathCallback: rolesController.create
	},
	{
		path: `/:id`,
		method: ['put'],
		pathCallback: rolesController.update
	},
	{
		path: `/`,
		method: ['delete'],
		pathCallback: rolesController.deleteAll
	},
	{
		path: `/:id`,
		method: ['delete'],
		pathCallback: rolesController.delete
	}
];

export const roleRoutes = (Role: IRoleBaseService) => {
	rolesController.init(Role);
	return roleRoute;
};
