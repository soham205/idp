import { CreationAttributes, Model } from 'sequelize';
import { dbConfig } from '../../../config';
import { IModelSchema, sequelizeWrapper } from '../../../plugins/sequelize-wrapper';
import { RolesSchema } from '../../../plugins/staqcms-plugin-user-role/modules/role/models/Role';

interface ICreateRoleEntry {
	id: number;
	name: string;
	slug: string;
	description: string;
}

interface IUpdateRoleEntry {
	id: number;
	name: string;
	slug: string;
	description: string;
}

interface IRetrieveRoleEntry {
	id: number | number;
	name: string;
	slug: string;
	description: string;
}

type ICreateRoleEntryFields = CreationAttributes<Model<ICreateRoleEntry>>;

type IUpdateRoleEntryFields = CreationAttributes<Model<IUpdateRoleEntry>>;
const rolesSchema = [...RolesSchema] as IModelSchema[];

const RolesModel = sequelizeWrapper.modelResolve(dbConfig, rolesSchema, 'roles');

export { RolesModel, ICreateRoleEntryFields, IUpdateRoleEntryFields, IRetrieveRoleEntry };
