import { IRouterElement } from '../../../plugins/staqcms-plugin-route-resolver/interfaces';
import { authController } from '../controllers/auth.controller';

const authRoutes: IRouterElement[] = [
	{
		path: '/getMobileOTP',
		method: ['post'],
		pathCallback: authController.getMobileOTP
	},
	{
		path: `/changeEmail`,
		method: ['post'],
		pathCallback: authController.changeEmail
	},
	{
		path: '/validateMobile',
		method: ['post'],
		pathCallback: authController.validateMobile
	},
	{
		path: `/register`,
		method: ['post'],
		pathCallback: authController.register
	},
	{
		path: `/login/local`,
		method: ['post'],
		pathCallback: authController.login
	},
	{
		path: `/confirmEmailAddress`,
		method: ['get'],
		pathCallback: authController.confirmEmailAddress
	},
	{
		path: `/forgotPassword`,
		method: ['post'],
		pathCallback: authController.forgotPassword
	},
	{
		path: `/resetPassword`,
		method: ['get'],
		pathCallback: authController.resetPassword
	},
	{
		path: `/changePassword`,
		method: ['post'],
		pathCallback: authController.changePassword
	}
];

export default authRoutes;
