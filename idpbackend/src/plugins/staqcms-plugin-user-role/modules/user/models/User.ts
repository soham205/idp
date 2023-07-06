import { IuserSchema } from '../../../interfaces/userinterface';

export const UserSchema: IuserSchema[] = [
	{
		fieldName: 'id',
		fieldType: 'INTEGER',
		fieldConstraints: {
			isPrimary: true,
			unique: true,
			allowNull: false
		}
	},
	{
		fieldName: 'fullname',
		fieldType: 'VARCHAR'
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
		fieldType: 'BOOLEAN'
	},
	{
		fieldName: 'isPhoneConfirmed',
		fieldType: 'BOOLEAN'
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
		fieldType: 'BOOLEAN'
	},
	{
		fieldName: 'isDeleted',
		fieldType: 'BOOLEAN'
	}
];
