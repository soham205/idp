import { Express } from 'express';
import { routerTable } from './routeTable';
import { API_VERSION, BASE_ENDPOINT, BODY_PARSER_JSON_SIZE_LIMIT } from './config';
import bodyParser from 'body-parser';
import staq_cms_routeResolve from './plugins/staqcms-plugin-route-resolver';

import passportMiddleWare from './middlewares/passportMiddleWare';

export const routes = {
	useNoBodyParserRoutes: async (app: Express): Promise<void> => {
		try {
			let noBodyParserRouteTable = await routerTable.getNoBodyParserTable();

			for (let routeList of noBodyParserRouteTable) {
				app.use(
					`${BASE_ENDPOINT}/${API_VERSION}/${routeList.module}/`,
					bodyParser.raw({ type: 'application/json' }),
					staq_cms_routeResolve.resolveRoute(routeList.table)
				);
			}
		} catch (noBodyParserRoutesError) {
			throw new Error(noBodyParserRoutesError as string);
		}
	},

	useRoutes: async (app: Express) => {
		try {
			app.use(
				bodyParser.json({
					limit: `${BODY_PARSER_JSON_SIZE_LIMIT.MEMORY_SIZE}${BODY_PARSER_JSON_SIZE_LIMIT.MEMORY_UNIT}`
				})
			);

			app.use(
				bodyParser.urlencoded({
					limit: '10mb',
					extended: true,
					parameterLimit: 50000
				})
			);

			let preRouteTable = await routerTable.getPreRouteTable();

			for (let routeList of preRouteTable) {
				app.use(
					`${BASE_ENDPOINT}/${API_VERSION}/${routeList.module}`,
					staq_cms_routeResolve.resolveRoute(routeList.table)
				);
			}


			let routeTable = await routerTable.getRouteTable();
			
			for (let routeList of routeTable) {
				app.use(
					`${BASE_ENDPOINT}/${API_VERSION}/${routeList.module}`,
					staq_cms_routeResolve.resolveProtectedRoute(routeList.table)
				);
			}
		} catch (useRoutesError) {
			throw new Error(useRoutesError as string);
		}
	}
};
