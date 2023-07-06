import { Response, NextFunction } from 'express';

import { aclUtils } from './aclUtils';
import { IAclConfig, IDecodedTokenRequestObject } from './interfaces';

let config: IAclConfig = {
	policies: new Map(),
	defaultRole: 'anonymous',
	baseUrl: '',
	rules: []
};

function returnPermissionDenied(res: Response) {
	return res.status(403).json({
		success: false,
		msg: 'Permission Denied: you are not allowed to access this resource.'
	});
}

export const acl = {
	config: (configObj: IAclConfig) => {
		config = {
			...config,
			...configObj
		};

		if (config && config.rules) {
			config.policies = aclUtils.mapPolicyToGroup(config.rules);
		} else {
			console.error('no policy found! All routes will be denied access.');
		}

		return config.policies;
	},

	authorize: (req: IDecodedTokenRequestObject, res: Response, next: NextFunction) => {
		let roles = aclUtils.getRolesFromRequest(req, config.defaultRole);

		if (!roles) {
			return next();
		}

		if (req.originalUrl === '/') {
			return next();
		}

		if (config.policies) {
			for (let role of roles) {
				let groupPolicies = config.policies.get(role);

				if (groupPolicies) {
					const permission = aclUtils.getPermissionForRoute(req.originalUrl, req.method, config.baseUrl, groupPolicies);

					if (permission && permission.action === 'allow') {
						return next();
					}
				}
			}
		}
		return returnPermissionDenied(res);
	}
};
