import { Express } from 'express';
import dotenv from 'dotenv';

import { BASE_ENDPOINT, MAIL_AUTH, PORT } from './config';

import { routes } from './routes';
import { middleWares } from './middlewares';
import { sequelizeWrapper } from './plugins/sequelize-wrapper/sequelizeModelResolve';
import { dbConfig } from './config';
import RolesServices from './extensions/roles/services/roles.services';

import { aclPolicies } from './middlewares/aclMiddleware/policies';
import { acl } from './plugins/staq-cms-plugin-acl';
import passportMiddleWare from './middlewares/passportMiddleWare';
import { StaqcmsNodeMailer } from 'staqcms-plugin-nodemailer-gmail';

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

async function configureAcl() {
	try {
		await aclPolicies.updateAclPolicies();
		let aclList = await aclPolicies.getAclPolicies();
		acl.config({
			baseUrl: BASE_ENDPOINT as string,
			defaultRole: 'public',
			rules: aclList
		});
	} catch (aclConfigError) {
		throw new Error(('ACL configuration error :: ' + aclConfigError) as string);
	}
}

async function initBackendServices() {
	try {
		await RolesServices.init();
		StaqcmsNodeMailer.init(MAIL_AUTH);
	} catch (initRoleServiceError) {
		throw new Error(initRoleServiceError as string);
	}
}

function startServer(app: Express) {
	app.listen(PORT, () => {
		console.info(`Server is listening at http://localhost:${PORT}`);
	});
}

const initBackend = async (app: Express) => {
	dotenv.config();

	try {
		await connectDatabase();
	} catch (dbConnectionError) {
		console.error('dbConnectionError :: ', dbConnectionError);
		killApp();
	}

	middleWares.applyCors(app);

	middleWares.applyMulterMiddleware(app);

	middleWares.applyAclMiddleware(app);

	middleWares.applySessionMiddleware(app);

	passportMiddleWare.initializePassportMiddleware(app);

	await configureAcl();

	await addRoutes(app);

	await initBackendServices();

	middleWares.applyErrorHandlingMiddleware(app);

	startServer(app);
};

export { initBackend };
