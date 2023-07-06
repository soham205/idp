import { CreationAttributes, Model } from 'sequelize';
import { dbConfig } from '../../../config';
import { IModelSchema, sequelizeWrapper } from '../../../plugins/sequelize-wrapper';
import { permission } from '../../../plugins/staqcms-plugin-permission';

interface ICreatePermissionEntry {
	// id: string | number;
	group: string;
	module: string;
	resource: string;
	method: string;
	displayMethod: string;
}

interface IPermissiontePermissionEntry {
	id: string | number;
	group: string;
	module: string;
	resource: string;
	method: string;
	displayMethod: string;
}

interface IRetrievePermissionEntry {
	id: number;
	group: string;
	module: string;
	resource: string;
	method: string;
	displayMethod: string;
}

type ICreatePermissionEntryFields = CreationAttributes<Model<ICreatePermissionEntry>>;

type IUpdatePermissionEntryFields = CreationAttributes<Model<IPermissiontePermissionEntry>>;

const PermissionsModel = sequelizeWrapper.modelResolve(
	dbConfig,
	permission.getPermissionSchema() as IModelSchema[],
	'permissions'
);

export {
	PermissionsModel,
	ICreatePermissionEntryFields,
	IUpdatePermissionEntryFields,
	IRetrievePermissionEntry,
	ICreatePermissionEntry
};
