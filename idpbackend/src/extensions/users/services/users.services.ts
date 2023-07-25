import {
	AUTH_MAIL_EVENTS_E,
	IAuthRegisterData,
	ITemplateValue,
	IUserBaseServices
} from '../../../plugins/staqcms-plugin-auth/interfaces';
import { IModuleBaseService, IModuleServiceResult } from '../../../commonInterfaces';
import UserBaseServices from './users.base.services';
import RolesServices from '../../roles/services/roles.services';
import { UserRoleMappingModel, UsersModel } from '../models/users.models';
import { FIND_ALL_FILTER_OPTONS_T } from '../../../commonInterfaces/IModuleServices';
import { RolesModel } from '../../../extensions/roles/models/roles.models';

import { CREATE_OR_FIND_USER_T } from '../../../plugins/staq-cms-plugin-google-login';
import { Profile } from 'passport';
import { AuthServices } from '../../../plugins/staqcms-plugin-auth/authService';
import { initAuthProps } from '../../../extensions/auth/controllers/auth.controller';
import { FRONT_END_URL, JWT_PROPS, SERVER_PROPS } from '../../../config';
import { StaqcmsNodeMailer } from 'staqcms-plugin-nodemailer-gmail';
import { AUTH_EMAIL_TEMPLATES } from '../../../AuthEmailTemplates/AuthEmailTemplates';

interface IUserServices extends IModuleBaseService {
	init: () => Promise<void>;
	// createUserAndAttachRoles: (userData: IAuthRegisterData, roles?: string[] | number[]) => Promise<IModuleServiceResult>;
	findByCondition: (id: FIND_ALL_FILTER_OPTONS_T) => Promise<IModuleServiceResult>;
	findOrCreate: CREATE_OR_FIND_USER_T;
}

function getUserByConidition(condition: FIND_ALL_FILTER_OPTONS_T): Promise<IModuleServiceResult> {
	return new Promise(async (resolve, reject) => {
		UsersModel.belongsToMany(RolesModel, { through: UserRoleMappingModel, foreignKey: 'userId' });
		RolesModel.belongsToMany(UsersModel, { through: UserRoleMappingModel, foreignKey: 'roleId' });

		// UserRoleMappingModel.belongsTo(UsersModel, { foreignKey: 'userId' });
		// UserRoleMappingModel.belongsTo(RolesModel, { foreignKey: 'RoleId' });

		// UsersModel.hasMany(UserRoleMappingModel, { foreignKey: 'id' });
		// RolesModel.hasMany(UserRoleMappingModel, { foreignKey: 'id' });

		UsersModel.findOne({ where: { ...condition }, include: { model: RolesModel } })
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

function createUser(userData: IAuthRegisterData): Promise<IModuleServiceResult> {
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
}

const UserServices: IUserServices = {
	...UserBaseServices,
	init: (): Promise<void> => {
		return new Promise((resolve, reject) => {});
	},
	create: (userData: IAuthRegisterData, roles?: string[] | number[]): Promise<IModuleServiceResult> => {
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

	findByCondition: (condition: FIND_ALL_FILTER_OPTONS_T): Promise<IModuleServiceResult> => {
		return getUserByConidition(condition);
	},

	findOrCreate: async (googleProfileDetails: Profile): Promise<unknown> => {
		try {
			const email = googleProfileDetails.emails ? googleProfileDetails.emails[0].value : '';
			console.log('email ---------------------------------------------------- ', email);

			let userDetails = await getUserByConidition({ email });

			if (!(userDetails && userDetails.success && userDetails.data)) {
				const initAuthProps = {
					authConfig: {
						FRONT_END_URL: FRONT_END_URL,
						JWT_LOGIN_EXPIRES_IN: JWT_PROPS.JWT_LOGIN_EXPIRES_IN,
						JWT_PASSWORD_RESET_EXPIRES_IN: JWT_PROPS.JWT_PASSWORD_RESET_EXPIRES_IN,
						JWT_VERIFICATION_EXPIRES_IN: JWT_PROPS.JWT_VERIFICATION_EXPIRES_IN,
						JWTSecret: JWT_PROPS.JWT_SECRET,
						SERVER_URL: SERVER_PROPS.SERVER_HOST
					},
					mailEventEmitter: (authevent: AUTH_MAIL_EVENTS_E, context: ITemplateValue) => {
						StaqcmsNodeMailer.sendMail(context.toEmail, AUTH_EMAIL_TEMPLATES[authevent], context).catch(
							(sendAuthEmailError: unknown) => {
								console.error(
									'auth_email_event_handler :: handleAuthFunctionEvent :: sendAuthEmailError :: ',
									sendAuthEmailError
								);
							}
						);
					},
					smsEventEmitter: () => {
						return new Promise<void>((resolve, reject) => {
							resolve();
						});
					},
					UserModel: UserServices as unknown as IUserBaseServices
				};

				const createUser = await new AuthServices(initAuthProps).register(
					{
						fullName: googleProfileDetails.displayName,
						email: email,
						password: '00000',
						password2: '00000'
					},
					false
				);
				console.log('createUser', createUser);
			}
			userDetails = await getUserByConidition({ email });
			return userDetails.data;
		} catch (findOrCreateUserError) {
			console.error('findOrCreateUserError :: ', findOrCreateUserError);
		}
	}
};

export default UserServices;
