import { Request, Response } from 'express';

interface IForeignKeyContraint {
	referenceTableName: string;
	referenceFieldName: string;
}

type DatabaseFieldType =
	| 'BIGINT'
	| 'BOOLEAN'
	| 'FLOAT'
	| 'INTEGER'
	| 'TEXT'
	| 'VARCHAR'
	| `VARCHAR(${number | ''})`
	| `uuid`;

interface IFieldConstraints {
	autoIncrement?: boolean;
	allowNull?: boolean;
	unique: boolean;
	isPrimary?: boolean;
	defaultValue?: string | boolean | number | null;
}

interface IForeignKeyContraint {
	referenceTableName: string;
	referenceFieldName: string;
}

interface IModuleServiceResult {
	data: unknown | null;
	message: string | null;
	success: boolean;
}

export type FIND_ALL_FILTER_OPTONS_T = {
	[kye in string]: string | number | boolean;
};

export interface ICreatePermissionData {
	group: string;
	module: string;
	resource: string;
	method: string;
	displayMethod: string;
	enable: boolean;
}

export interface IUpdatePermissionData {
	_id: string | number;
	group?: string;
	module?: string;
	resource?: string;
	method?: string;
	displayMethod?: string;
	enable?: boolean;
}

export interface IPermissionSchema {
	fieldName: string;
	fieldType: DatabaseFieldType;
	fieldConstraints?: IFieldConstraints;
	foreignKeyContraints?: IForeignKeyContraint[];
}

export interface IPermissionServiceResult {
	success: boolean;
	msg: string;
	data: IPermissionServiceResult | null;
}

export interface IInitPermissionServiceProps {
	create: (createData: any) => Promise<IModuleServiceResult>;
	findAll: (findAllFilterOptions?: FIND_ALL_FILTER_OPTONS_T) => Promise<IModuleServiceResult>;
	findOne: (_id: string | number) => Promise<IModuleServiceResult>;
	update: (_id: string | number, updateData: any) => Promise<IModuleServiceResult>;
	deleteOne: (_id: string | number) => Promise<IModuleServiceResult>;
	deleteAll: () => Promise<IModuleServiceResult>;
}

export interface IPermissionController {
	init: (permissionServiceProps: IInitPermissionServiceProps) => void;
	create: (req: Request, res: Response) => Promise<void>;
	find: (req: Request, res: Response) => Promise<void>;
	findOne: (req: Request, res: Response) => Promise<void>;
	update: (req: Request, res: Response) => Promise<void>;
	updatePermissions: (req: Request, res: Response) => Promise<void>;
	delete: (req: Request, res: Response) => Promise<void>;
	deleteAll: (req: Request, res: Response) => Promise<void>;
}
