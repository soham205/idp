import { Express } from 'express';
import dotenv from 'dotenv';

import { JWT_SECRET, PORT } from './config';

import { routes } from './routes';
import { middleWares } from './middlewares';
import { sequelizeWrapper } from './plugins/sequelize-wrapper/sequelizeModelResolve';
import { dbConfig } from './config';
import RolesServices from './extensions/roles/services/roles.services';

import staqcms_plugin_auth from './plugins/staqcms-plugin-auth';
import UserServices from './extensions/users/services/users.services';
import { IUserBaseServices } from './plugins/staqcms-plugin-auth/interfaces';

function killApp() {
	process.exit(1);
}

function addRoutes(app: Express): Promise<void> {
	return new Promise<void>((resolve, reject) => {
		routes
			.useRoutes(app)
			.then(() => {
				resolve();
			})
			.catch((routesError) => {
				console.error('routesError :: ', routesError);
				reject(routesError);
			});
	});
}

function connectDatabase() {
	return new Promise<void>((resolve, reject) => {
		sequelizeWrapper
			.connectDatabase(dbConfig)
			.then(() => {
				console.log('Database Connected');
				resolve();
			})
			.catch((databaseConnectionError) => {
				console.log('databaseConnectionError :: ', databaseConnectionError);
				reject(databaseConnectionError);
			});
	});
}

async function initBackendServices() {
	await RolesServices.init();

	const defaultRoleItem = await RolesServices.getDefaultRole();
	if (defaultRoleItem && defaultRoleItem.id) {
		staqcms_plugin_auth.init({
			authConfig: {
				FRONT_END_URL: 'sjkfaskjf',
				JWT_LOGIN_EXPIRES_IN: '10d',
				JWT_PASSWORD_RESET_EXPIRES_IN: '10m',
				JWT_VERIFICATION_EXPIRES_IN: '10h',
				JWTSecret: JWT_SECRET,
				SERVER_URL: ''
			},
			defaultRoleId: defaultRoleItem.id,
			mailEventEmitter: (arg1, arg2) => {},
			smsEventEmitter: () => {
				return new Promise((resolve, reject) => {
					resolve();
				});
			},
			UserModel: UserServices as unknown as IUserBaseServices
		});
	}
	// return new Promise<void>((resolve, reject) => {
	// 	Promise.all([RolesServices.init()])
	// 		.then(() => {
	// 			resolve();
	// 		})
	// 		.catch((initServicesError) => {
	// 			reject(initServicesError);
	// 		});
	// });
}

function startServer(app: Express) {
	app.listen(PORT, () => {
		console.info(`Server is listening at http://localhost:${PORT}`);
	});
}

const initBackend = (app: Express) => {
	dotenv.config();
	const promiseArray: Promise<void>[] = [];
	
	middleWares.applyCors(app);
	promiseArray.push(addRoutes(app));
	promiseArray.push(connectDatabase());

	Promise.all(promiseArray)
		.then(() => {
			initBackendServices()
				.then(() => {
					middleWares.applyMulterMiddleware(app);
					middleWares.applyAclMiddleware(app);
					middleWares.applyErrorHandlingMiddleware(app);

					startServer(app);
				})
				.catch((initServicesError) => {
					console.error('initServicesError :: ', initServicesError);
					killApp();
				});
		})
		.catch((promiseAllError) => {
			console.error('promiseAllError :: ', promiseAllError);
			killApp();
		});
};

export { initBackend };
