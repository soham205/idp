import { Request, Response } from 'express';

type ORDER_BY_DIRECTION_T = 'asc' | 'desc';

type DatabaseFieldType = 'BIGINT' | 'BOOLEAN' | 'FLOAT' | 'INTEGER' | 'TEXT' | 'VARCHAR' | `VARCHAR(${number | ''})`;

interface IFieldConstraints {
    autoIncrement?: boolean;
    allowNull?: boolean;
    unique: boolean,
    isPrimary?: boolean
    defaultValue?: string | boolean | number | null
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

type FIND_ALL_FILTER_OPTONS_T = {
	[kye in string]: string | number | boolean;
};

interface IPagingOptions {
	record?: number;
	offset?: number;
	sortByColumn?: string;
	oderByDirection?: ORDER_BY_DIRECTION_T;
}

export interface ICreateUserData {
	fullName: string;
	email: string;
	newEmail: string;
	phoneNumber: string;
	newPhoneNumber: string;
	password: string;
	avatar_url: string;
	isConfirmed: boolean;
	isPhoneConfirmed: boolean;
	phoneOTP: number;
	resetPasswordToken: string;
	isPasswordReset: boolean;
	provider: string;
	isDeleted: boolean;
}

export interface IuserSchema {
	fieldName: string;
	fieldType: DatabaseFieldType;
	fieldConstraints?: IFieldConstraints;
	foreignKeyContraints?: IForeignKeyContraint[];
}

export type USER_CREATE_SERVICE_t = (createData: ICreateUserData) => Promise<void>;

export type USER_FIND_SERVICE_T = (condition?: unknown) => Promise<unknown[] | null>;

export type USER_FIND_ONE_SERVICE_T = (id: string | number) => Promise<unknown>;

export type USER_UPDATE_SERVICE_T = (id: string | number, updateData: ICreateUserData) => Promise<unknown>;

export type USER_DELETE_SERVICE_T = (id: string | number) => Promise<void>;

export type USER_DELETE_ALL_SERVICE_T = (condition: unknown) => Promise<void>;

export interface IInitUserServiceProps {
	create: (createData: any) => Promise<IModuleServiceResult>;
	findAll: (
		findAllPagingOptions: IPagingOptions,
		findAllFilterOptions?: FIND_ALL_FILTER_OPTONS_T
	) => Promise<IModuleServiceResult>;
	findOne: (id: string | number) => Promise<IModuleServiceResult>;
	update: (id: string | number, updateData: any) => Promise<IModuleServiceResult>;
	deleteOne: (id: string | number) => Promise<IModuleServiceResult>;
	deleteAll: () => Promise<IModuleServiceResult>;
}

export interface IUserController {
	init: (userServiceProps: IInitUserServiceProps) => void;
	create: (req: Request, res: Response) => Promise<void>;
	find: (req: Request, res: Response) => Promise<void>;
	findOne: (req: Request, res: Response) => Promise<void>;
	update: (req: Request, res: Response) => Promise<void>;
	delete: (req: Request, res: Response) => Promise<void>;
	deleteAll: (req: Request, res: Response) => Promise<void>;
}
