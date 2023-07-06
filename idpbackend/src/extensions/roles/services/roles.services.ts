import { defaultRoles, DEFAULT_ROLE_SLUG } from '../../../extensions/config/defaultRoles/index';
import { IModuleBaseService } from '../../../commonInterfaces';
import { ICreateRoleEntryFields, IRetrieveRoleEntry, RolesModel } from '../models/roles.models';
import RolesBaseServices from './roles.base.services';
import { Op } from 'sequelize';

interface IRoleServices extends IModuleBaseService {
	init: () => Promise<void>;
	getDefaultRole: () => Promise<IRetrieveRoleEntry | null>;
	getAllRoles: () => Promise<IRetrieveRoleEntry[]>;
}

const RolesServices: IRoleServices = {
	...RolesBaseServices,

	init: function (): Promise<void> {
		return new Promise((resolve, reject) => {
			let roleSlugs = Object.values(defaultRoles).map((item) => item.slug);
			RolesModel.findAll({ where: { slug: { [Op.in]: roleSlugs } } })
				.then((existingRoles) => {
					// Check if all roles are presnt in the db.
					if (!(existingRoles && existingRoles.length === Object.values(defaultRoles).length)) {
						RolesModel.bulkCreate(Object.values(defaultRoles) as ICreateRoleEntryFields[])
							.then(() => {
								resolve();
							})
							.catch((createRoleError) => {
								reject(createRoleError);
							});
					} else {
						return resolve();
					}
				})
				.catch((findRoleError) => {
					reject(findRoleError);
				});
		});
	},
	getDefaultRole: function (): Promise<IRetrieveRoleEntry | null> {
		return new Promise((resolve, reject) => {
			RolesModel.findOne({ where: { slug: DEFAULT_ROLE_SLUG }, raw: true })
				.then((roleResult) => {
					resolve(roleResult as IRetrieveRoleEntry | null);
				})
				.catch((findRoleError) => {
					reject(findRoleError);
				});
		});
	},
	getAllRoles: function (): Promise<IRetrieveRoleEntry[]> {
		return new Promise((resolve, reject) => {
			RolesModel.findAll()
				.then((rolereslt) => {
					resolve(rolereslt as unknown as IRetrieveRoleEntry[]);
				})
				.catch((getRoleError) => {
					console.error('getRoleError :: ', getRoleError);
					reject(getRoleError);
				});
		});
	}
};

export default RolesServices;
