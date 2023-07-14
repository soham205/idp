import assert from 'assert';
import { IDecodedTokenRequestObject, IGroupWiseAcl, IPoliciyElement } from './interfaces';

const stripQueryStrings = (url: string) => url.split(/[?#]/)[0];

const assertIsGlobOrArray = (term: string[], name: string) => {
	if (typeof term !== 'string' && !Array.isArray(term)) {
		throw new Error(`TypeError: ${name} should be a array or string`);
	}

	if (typeof term === 'string' && term !== '*') {
		throw new Error(`DefinitionError: Unrecognised glob "${term}" , use "*" instead`);
	}
};

const urlToArray = (url: string) => {
	if (typeof url !== 'string') {
		throw new Error('Only String Arguments are allowed.');
	}
	return url.replace(/^\/+|\/+$/gm, '').split('/');
};

const createRegexFromResource = (resource: string) => {
	if (resource.startsWith(':') || resource === '*') return '.*';
	return `^${resource}$`;
};

const matchRouteToResource = (route: string, resource: string) => {
	if (resource === '*') return true;

	const routeArray = urlToArray(route);
	const resourceArray = urlToArray(resource);

	for (let routeArrayCounter = 0; routeArrayCounter < routeArray.length; routeArrayCounter++) {
		if (routeArrayCounter >= resourceArray.length) return false;

		if (resourceArray[routeArrayCounter] === '*') return true;

		if (!routeArray[routeArrayCounter].match(createRegexFromResource(resourceArray[routeArrayCounter]))) return true;
	}

	if (resourceArray.length > routeArray.length) {
		return resourceArray[routeArray.length] == '*';
	}
	return true;
};

export const aclUtils = {
	mapPolicyToGroup: (policies: IGroupWiseAcl[]): Map<string, IPoliciyElement[]> => {
		const mappedPolicies = new Map<string, IPoliciyElement[]>();

		if (policies) {
			policies.forEach((policy) => {
				assert.equal(typeof policy.group, 'string');
				assert.equal(Array.isArray(policy.permissions), true);

				policy.permissions.forEach((permission) => {
					assert(typeof permission.resource, 'string');
					assertIsGlobOrArray(permission.methods, 'Methods');
					if (permission.action !== 'allow' && permission.action !== 'deny') {
						throw new Error('TypeError: action should be either "deny" or "allow"');
					}
				});
				// Transform policies into a map
				mappedPolicies.set(policy.group, policy.permissions);
			});
		}

		return mappedPolicies;
	},

	getRolesFromRequest: (req: IDecodedTokenRequestObject, defaultRole: string) => {
		if (!req.decoded) {
			return;
		}

		let roles = req.decoded.roles;

		if (!roles) {
			return [defaultRole];
		}

		if (typeof roles === 'string') {
			roles = [roles];
		}

		return roles;
	},

	getPermissionForRoute: (
		route: string,
		methodName: string,
		configBaseUrl: string = '',
		policies: IPoliciyElement[]
	) => {
		route = stripQueryStrings(route);

		if (policies) {
			for (let permission of policies) {
				let resource = permission.resource;

				if (configBaseUrl) {
					resource = `${configBaseUrl}/${resource}`.replace(/\/+/g, '/');
				}
				if (matchRouteToResource(route, resource)) {
					let methodsRegex;
					if (Array.isArray(permission.methods)) {
						methodsRegex = new RegExp(permission.methods.join('|'), 'i');
					}
					if (
						permission.methods === '*' ||
						permission.methods.includes('*') ||
						(methodsRegex && methodsRegex.test(methodName) && permission.action === 'allow')
					)
						console.log('Permission-----------------', permission);
					return permission;
				}
			}
		}
	}
};
