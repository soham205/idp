import { getUUID } from '../../../utils';
import { ICreatePermissionEntry } from '../../../extensions/permissions/models/permissions.models';
import { routerTable } from '../../../routeTable';

const routeInfo: ICreatePermissionEntry[] = [];

async function getAllRouteInfo() {
	let routeTable = [];
	try {
		routeTable = await routerTable.getRouteTable();

		for (let tuple of routeTable) {
			for (let route of tuple.table) {
				for (let method of route.method) {
					if (route.pathCallback) {
						routeInfo.push({
							group: '',
							module: `${tuple.module}`,
							resource: `${tuple.module}${route.path}`,
							method,
							displayMethod: `${route.pathCallback.name} (${method})`
						});
					}
				}
			}
		}
	} catch (getAllRouteInfoError) {
		console.error('getAllRoutes :: getAllRouteInfoError :: ', getAllRouteInfoError);
	}

	return routeInfo;
}

//get all routes
const aclList = {
	getAllRouteInfo: async () => {
		return await getAllRouteInfo();
	}
};

export { aclList };
