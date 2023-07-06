import { IRouterElement } from '../../plugins/staqcms-plugin-route-resolver/interfaces';

export enum ROUTES_SUFFIXES_E {
	ROUTES_SUFFIX = 'routes',
	PRE_ROUTES_SUFFIX = 'pre.routes',
	NO_BODY_PARSER_ROUTES_SUFFIX = 'no.body.parser.routes'
}

export enum ROUTE_LOCATIONS_E {
	MODULES = 'modules',
	EXTENSIONS = 'extensions',
	API = 'api'
}

export interface IRouteTableEntry {
	table: IRouterElement[];
	module: string;
}
