import { IuserSchema } from '../../../interfaces/userinterface';

export const UserSchema: IuserSchema[] = [
	{
		fieldName: 'id',
		fieldType: 'INTEGER',
		fieldConstraints: {
			isPrimary: true,
			unique: true
		}
	},
	{
		fieldName: 'fullName',
		fieldType: 'VARCHAR',
		fieldConstraints: {
			isPrimary: false,
			unique: false,
			allowNull: true
		}
	},
	{
		fieldName: 'email',
		fieldType: 'VARCHAR'
	},
	{
		fieldName: 'newEmail',
		fieldType: 'VARCHAR'
	},
	{
		fieldName: 'phoneNumber',
		fieldType: 'VARCHAR'
	},
	{
		fieldName: 'newPhoneNumber',
		fieldType: 'VARCHAR'
	},
	{
		fieldName: 'password',
		fieldType: 'VARCHAR'
	},
	{
		fieldName: 'avtarUrl',
		fieldType: 'VARCHAR'
	},
	{
		fieldName: 'isConfirmed',
		fieldType: 'BOOLEAN',
		fieldConstraints: {
			unique: false,
			defaultValue: false
		}
	},
	{
		fieldName: 'isPhoneConfirmed',
		fieldType: 'BOOLEAN',
		fieldConstraints: {
			unique: false,
			defaultValue: false
		}
	},
	{
		fieldName: 'phoneOTP',
		fieldType: 'VARCHAR'
	},
	{
		fieldName: 'resetPasswordToken',
		fieldType: 'VARCHAR'
	},
	{
		fieldName: 'isPasswordReset',
		fieldType: 'BOOLEAN',
		fieldConstraints: {
			unique: false,
			defaultValue: false
		}
	},
	{
		fieldName: 'isDeleted',
		fieldType: 'BOOLEAN',
		fieldConstraints: {
			unique: false,
			defaultValue: false
		}
	}
];
