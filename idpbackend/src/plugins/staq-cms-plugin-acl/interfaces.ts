import { Request } from 'express';

type POLICY_METHOS_T = 'get' | 'post' | 'put' | 'delete';

export interface IPermissionElement {
	group: string;
	enable: boolean;
	module: string;
	resource: string;
	method: POLICY_METHOS_T;
	displayMethod: string;
}

interface IAclItem {
	resource: string;
	methods: string[];
	action: string;
}

export interface IGroupWiseAcl {
	group: string;
	permissions: IAclItem[];
}

export interface IPoliciyElement {
	resource: string;
	methods: string[] | string;
	action: string;
}

export interface IDecodedToken {
	id: string;
	fullname: string;
	roles: string[];
	reqSource?: string;
	iat: number;
	exp: number;
}

export interface IinitAclConfig {
	baseUrl: string;
	defaultRole: string;
	rules: IGroupWiseAcl[];
}

export interface IAclConfig extends IinitAclConfig {
	policies?: Map<string, IPoliciyElement[]>;
	defaultRole: string;
}
export interface IDecodedTokenRequestObject extends Request {
	decoded?: IDecodedToken;
	userId?: string | number;
}
