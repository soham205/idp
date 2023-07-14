import { Express, NextFunction, Response } from 'express';
import { IDecodedToken, IDecodedTokenRequestObject } from '../../plugins/staq-cms-plugin-acl/interfaces';
import { acl } from '../../plugins/staq-cms-plugin-acl';
import jwt from 'jsonwebtoken';
import { aclPolicies } from './policies';
import { BASE_ENDPOINT, JWT_PROPS } from '../../config';

const aclMiddleware = {
	attachDecodedTokenToRequest: (app: Express) => {
		app.use((req: IDecodedTokenRequestObject, res: Response, next: NextFunction) => {
			let token = req.headers.authorization;
			if (!token) {
				return next();
			}
			token = token.split(' ')[1];
			jwt.verify(token, JWT_PROPS.JWT_SECRET, function (err: unknown, decoded) {
				if (err) {
					console.error(err);
					return next();
				} else {
					if (decoded && typeof decoded !== 'string') {
						req.decoded = decoded as IDecodedToken;
						req.userId = decoded.id as string;
					} else {
						console.error('Cannot get decoded token details !');
					}
				}
				return next();
			});
		});
	},
	applyAclMiddleware: async (app: Express) => {
		await aclPolicies.updateAclPolicies();
		let aclList = await aclPolicies.getAclPolicies();
		acl.config({
			baseUrl: BASE_ENDPOINT as string,
			defaultRole: 'public',
			rules: aclList
		});
		
		app.use(async (req, res, next) => {
			acl.authorize(req as IDecodedTokenRequestObject, res, next);
		});
	}
};
export { aclMiddleware };
