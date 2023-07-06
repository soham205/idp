import { Request, Response } from 'express';

type DatabaseFieldType = 'BIGINT' | 'BOOLEAN' | 'FLOAT' | 'INTEGER' | 'TEXT' | 'VARCHAR' | `VARCHAR(${number | ''})`;

type ORDER_BY_DIRECTION_T = 'asc' | 'desc';

type FIND_ALL_FILTER_OPTONS_T = {
	[kye in string]: string | number | boolean;
};

interface IModuleServiceResult {
	data: unknown | null;
	message: string | null;
	success: boolean;
}

interface IPagingOptions {
	record?: number;
	offset?: number;
	sortByColumn?: string;
	oderByDirection?: ORDER_BY_DIRECTION_T;
}

interface IRoleBaseService {
	create: (createData: any) => Promise<IModuleServiceResult>;
	findAll: (
		findAllFilterOptions?: FIND_ALL_FILTER_OPTONS_T
	) => Promise<IModuleServiceResult>;
	findOne: (_id: string | number) => Promise<IModuleServiceResult>;
	update: (_id: string | number, updateData: any) => Promise<IModuleServiceResult>;
	deleteOne: (_id: string | number) => Promise<IModuleServiceResult>;
	deleteAll: () => Promise<IModuleServiceResult>;
}

interface IFieldConstraints {
	autoIncrement?: boolean;
	allowNull: boolean;
	unique: boolean;
	isPrimary?: boolean;
}

interface IForeignKeyContraint {
	referenceTableName: string;
	referenceFieldName: string;
}

interface ICreateRoleData {
	name: string;
	slug: string;
	description: string;
}

interface IRolesSchema {
	fieldName: string;
	fieldType: DatabaseFieldType;
	fieldConstraints?: IFieldConstraints;
	foreignKeyContraints?: IForeignKeyContraint[];
}

interface IRolesController {
	init: (roleServiceProps: IRoleBaseService) => void;
	create: (req: Request, res: Response) => Promise<void>;
	find: (req: Request, res: Response) => Promise<void>;
	findOne: (req: Request, res: Response) => Promise<void>;
	update: (req: Request, res: Response) => Promise<void>;
	delete: (req: Request, res: Response) => Promise<void>;
	deleteAll: (req: Request, res: Response) => Promise<void>;
}

export { IRoleBaseService, ICreateRoleData, IRolesSchema, IRolesController, FIND_ALL_FILTER_OPTONS_T };
