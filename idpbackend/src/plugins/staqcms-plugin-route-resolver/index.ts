import pc from 'picocolors';
import express, { NextFunction, Request, Response, Router } from 'express';

import { AsyncFunction, AUTHENTICATION_STRATERGY_T, IProtectedRouterElement } from './interfaces';
import passport from 'passport';

const asyncHandler = (execution: AsyncFunction) => (req: Request, res: Response, next: NextFunction) => {
	execution(req, res, next).catch(next);
};

function getPath(routeComponent: IProtectedRouterElement) {
	if (!routeComponent.path) {
		pc.red(pc.bold(`\nERROR: path for routeComponent is not supplied.`));
	}
	if (typeof routeComponent.path !== 'string') {
		pc.red(pc.bold(`\nERROR: type of path object is not string. Received type - ${typeof routeComponent.path}`));
	}
	return routeComponent.path;
}

function getCallback(routeComponent: IProtectedRouterElement) {
	if (!routeComponent.path) {
		pc.red(pc.bold(`\nERROR: callback function for routeComponent is not supplied.`));
	}
	return routeComponent.pathCallback;
}

const staq_cms_routeResolve = {
	resolveProtectedRoute: (routeTable: IProtectedRouterElement[]) => {
		const router = Router();
		for (let routeComponent of routeTable) {
			if (!routeComponent) {
				pc.red(pc.bold(`\nERROR: routeComponent is not supplied`));
			}

			if (!routeComponent.method) {
				pc.red(pc.bold(`\nERROR: method for routeComponent is not supplied for path - ${routeComponent.path}`));
			}

			if (typeof routeComponent.method === 'string') {
				routeComponent.method = [routeComponent.method];
			}

			if (!routeComponent.method.length) {
				pc.red(
					pc.bold(
						`\nERROR: type of method object is not array or the array is empty. Received type - ${typeof routeComponent.method}`
					)
				);
			}

			let pathName = getPath(routeComponent);
			let callbackFn: AsyncFunction = getCallback(routeComponent);

			if (!pathName || !callbackFn) {
				continue;
			}

			for (let methodName of routeComponent.method) {
				if (typeof methodName !== 'string') {
					pc.red(pc.bold(`\nERROR: type of method in the array is not string. Received type - ${typeof methodName}`));
				}

				const strategy = routeComponent.authenticationStrategy ? routeComponent.authenticationStrategy : 'jwt';

				switch (methodName.toLowerCase()) {
					case 'get':
						router.get(pathName, passport.authenticate(strategy, { session: false }), asyncHandler(callbackFn));
						break;
					case 'post':
						router.post(pathName, passport.authenticate(strategy, { session: false }), asyncHandler(callbackFn));
						break;
					case 'put':
						router.put(pathName, passport.authenticate(strategy, { session: false }), asyncHandler(callbackFn));
						break;
					case 'delete':
						router.delete(pathName, passport.authenticate(strategy, { session: false }), asyncHandler(callbackFn));
						break;
					default:
						pc.red(
							pc.bold(
								`\nERROR: unrecognized method for routeComponent passed. path - ${routeComponent.path} method - ${methodName}`
							)
						);
				}
			}
		}
		return router;
	},

	resolveRoute: (routeTable: IProtectedRouterElement[]) => {
		const router = Router();
		for (let routeComponent of routeTable) {
			if (!routeComponent) {
				pc.red(pc.bold(`\nERROR: routeComponent is not supplied`));
			}

			if (!routeComponent.method) {
				pc.red(pc.bold(`\nERROR: method for routeComponent is not supplied for path - ${routeComponent.path}`));
			}

			if (typeof routeComponent.method === 'string') {
				routeComponent.method = [routeComponent.method];
			}

			if (!routeComponent.method.length) {
				pc.red(
					pc.bold(
						`\nERROR: type of method object is not array or the array is empty. Received type - ${typeof routeComponent.method}`
					)
				);
			}

			let pathName = getPath(routeComponent);
			let callbackFn: AsyncFunction = getCallback(routeComponent);

			if (!pathName || !callbackFn) {
				continue;
			}

			for (let methodName of routeComponent.method) {
				if (typeof methodName !== 'string') {
					pc.red(pc.bold(`\nERROR: type of method in the array is not string. Received type - ${typeof methodName}`));
				}

				switch (methodName.toLowerCase()) {
					case 'get':
						router.get(pathName, asyncHandler(callbackFn));
						break;
					case 'post':
						router.post(pathName, asyncHandler(callbackFn));
						break;
					case 'put':
						router.put(pathName, asyncHandler(callbackFn));
						break;
					case 'delete':
						router.delete(pathName, asyncHandler(callbackFn));
						break;
					default:
						pc.red(
							pc.bold(
								`\nERROR: unrecognized method for routeComponent passed. path - ${routeComponent.path} method - ${methodName}`
							)
						);
				}
			}
		}
		return router;
	}
};

export default staq_cms_routeResolve;
