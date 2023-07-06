import { IPermissionSchema } from '../../../interfaces/index';

export const PermissionSchema: IPermissionSchema[] = [
	{
		fieldName: 'id',
		fieldType: 'INTEGER',
		fieldConstraints: {
			unique: true,
			isPrimary: true,
			autoIncrement: true
		}
	},
	{
		fieldName: 'group',
		fieldType: 'VARCHAR'
	},
	{
		fieldName: 'module',
		fieldType: 'VARCHAR'
	},
	{
		fieldName: 'resource',
		fieldType: 'VARCHAR'
	},
	{
		fieldName: 'method',
		fieldType: 'VARCHAR'
	},
	{
		fieldName: 'displayMethod',
		fieldType: 'VARCHAR'
	},
	{
		fieldName: 'enable',
		fieldType: 'BOOLEAN',
		fieldConstraints: {
			defaultValue: false,
			unique: false,
			allowNull: false
		}
	}
];
