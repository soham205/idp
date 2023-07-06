import { IAuthRegisterData } from '../../../plugins/staqcms-plugin-auth/interfaces';
import { IModuleBaseService, IModuleServiceResult } from '../../../commonInterfaces';
import UserBaseServices from './users.base.services';
import RolesServices from '../../roles/services/roles.services';
import { UserRoleMappingModel, UsersModel } from '../models/users.models';
import { FIND_ALL_FILTER_OPTONS_T } from '../../../commonInterfaces/IModuleServices';
import { RolesModel } from '../../../extensions/roles/models/roles.models';

interface IUserServices extends IModuleBaseService {
	init: () => Promise<void>;
	// createUserAndAttachRoles: (userData: IAuthRegisterData, roles?: string[] | number[]) => Promise<IModuleServiceResult>;
	findByCondition: (_id: FIND_ALL_FILTER_OPTONS_T) => Promise<IModuleServiceResult>;
}

const UserServices: IUserServices = {
	...UserBaseServices,
	init: function (): Promise<void> {
		return new Promise((resolve, reject) => { });
	},
	create: function (userData: IAuthRegisterData, roles?: string[] | number[]): Promise<IModuleServiceResult> {
		//TODO user roles argument and create mapping entries.
		return new Promise((resolve, reject) => {
			RolesServices.getDefaultRole()
				.then((defaultRole) => {
					if (!defaultRole) {
						return reject(new Error('Default role missing cannot create user.'));
					}
					UserBaseServices.create(userData)
						.then((createResult) => {

							if (createResult && createResult.success && createResult.data) {
								const userId = createResult.data;
								UserRoleMappingModel.create({ roleId: defaultRole.id, userId })
									.then(() => {
										resolve({
											data: createResult.data,
											message: '',
											success: true
										});
									})
									.catch((createUserMappingModelEntryError) => {
										reject(createUserMappingModelEntryError);
									});
							} else {
								return reject(new Error('Cannot get created user id.'));
							}
						})
						.catch((createUserError) => {
							reject(createUserError);
						});
				})
				.catch((getDefaultRoleError) => {
					reject(getDefaultRoleError);
				});
		});
	},
	findByCondition: function (condition: FIND_ALL_FILTER_OPTONS_T): Promise<IModuleServiceResult> {
		return new Promise(async (resolve, reject) => {

			UsersModel.belongsToMany(RolesModel, { through: UserRoleMappingModel, foreignKey: 'userId' });
			RolesModel.belongsToMany(UsersModel, { through: UserRoleMappingModel, foreignKey: 'roleId' })

			// UserRoleMappingModel.belongsTo(UsersModel, { foreignKey: 'userId' });
			// UserRoleMappingModel.belongsTo(RolesModel, { foreignKey: 'RoleId' });

			// UsersModel.hasMany(UserRoleMappingModel, { foreignKey: 'id' });
			// RolesModel.hasMany(UserRoleMappingModel, { foreignKey: 'id' });

			UsersModel.findAll({ where: { ...condition }, include: { model: RolesModel } })
				.then((findOneEntryResult) => {
					resolve({
						data: JSON.parse(JSON.stringify(findOneEntryResult)),
						message: '',
						success: true
					});
				})
				.catch((findOneEntryResult) => {
					/**
					 *  Error Handling TO BE DONE.
					 */
					console.log('findOneEntryResult', findOneEntryResult);

					reject(findOneEntryResult);
				});
		});
	}
};

export default UserServices;
