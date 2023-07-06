import { CreationAttributes, DataTypes, InferCreationAttributes, Model } from 'sequelize';
import { dbConfig } from '../../../config';
import { IModelSchema, sequelizeWrapper } from '../../../plugins/sequelize-wrapper';
import { UserRole } from '../../../plugins/staqcms-plugin-user-role';

interface ICreateUserEntry {
	fullname: string;
	email: string;
	password: string;
}

interface IUpdateUserEntry {
	id: number;
	name: string;
	slug: string;
	description: string;
}
const usersScema = [...UserRole.getUserSchema() as IModelSchema[]]
const userRoleMappingSchema: IModelSchema[] = [
	{
		fieldName: 'id',
		fieldType: 'INTEGER',
		fieldConstraints: {
			allowNull: false,
			isPrimary: true,
			autoIncrement: true,
			unique: true,
		}
	},
	{
		fieldName: 'roleId',
		fieldType: 'INTEGER',
		fieldConstraints: {
			unique: false,
			allowNull: false,
		},
		foreignKeyContraints: {
			referenceFieldName: 'id',
			referenceTableName: 'roles'
		}
	},
	{
		fieldName: 'userId',
		fieldType: 'INTEGER',
		fieldConstraints: {
			unique: false,
			allowNull: false,
		},
		foreignKeyContraints: {
			referenceFieldName: 'id',
			referenceTableName: 'users'
		}
	}
];

type ICreateUserEntryFields = CreationAttributes<Model<ICreateUserEntry>>;

type IUpdateUserEntryFields = CreationAttributes<Model<IUpdateUserEntry>>;

const UsersModel = sequelizeWrapper.modelResolve(dbConfig, usersScema, 'users');

const UserRoleMappingModel = sequelizeWrapper.modelResolve(dbConfig, userRoleMappingSchema, 'users_roles_mapping');

export { UsersModel, ICreateUserEntryFields, IUpdateUserEntryFields, UserRoleMappingModel };
