import { NextFunction, Request, Response } from 'express';
import { Strategy } from 'passport-jwt';
import passport, { Authenticator } from 'passport';

type METHOD_TYPE_T = 'get' | 'put' | 'post' | 'delete' | 'patch';

export type AUTHENTICATION_STRATERGY_T = 'google' | 'local' | 'facebook' | 'jwt';

export type AsyncFunction = (req: Request, res: Response, Next: NextFunction) => Promise<void | unknown>;

export interface IBaseRouterElement {
	path: string;
	pathCallback: AsyncFunction;
	method: METHOD_TYPE_T[];
}

export interface IProtectedRouterElement extends IBaseRouterElement {
	authenticationStrategy: AUTHENTICATION_STRATERGY_T;
}

