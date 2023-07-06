import { IRolesSchema } from '../../../interfaces/roleInterfaces';

export const RolesSchema: IRolesSchema[] = [
	{
		fieldName: 'id',
		fieldType: 'INTEGER',
		fieldConstraints: {
			allowNull: false,
			unique: true,
			autoIncrement: true,
			isPrimary: true
		}
	},
	{
		fieldName: 'name',
		fieldType: 'VARCHAR',
		fieldConstraints: {
			allowNull: false,
			unique: false
		}
	},
	{
		fieldName: 'slug',
		fieldType: 'VARCHAR',
		fieldConstraints: {
			allowNull: false,
			unique: true
		}
	},
	{
		fieldName: 'description',
		fieldType: 'VARCHAR',
		fieldConstraints: {
			allowNull: true,
			unique: false
		}
	}
];
