import passport from 'passport';
import { IBaseRouterElement, IProtectedRouterElement } from '../../../plugins/staqcms-plugin-route-resolver/interfaces';
import { authController } from '../controllers/auth.controller';

const authRoutes: IProtectedRouterElement[] = [
	{
		path: '/getMobileOTP',
		method: ['post'],
		pathCallback: authController.getMobileOTP,
		authenticationStrategy:'jwt'
	},
	{
		path: `/changeEmail`,
		method: ['post'],
		pathCallback: authController.changeEmail,
		authenticationStrategy:'jwt'
	},
	{
		path: '/validateMobile',
		method: ['post'],
		pathCallback: authController.validateMobile,
		authenticationStrategy:'jwt'
	},
	{
		path: `/register`,
		method: ['post'],
		pathCallback: authController.register,
		authenticationStrategy:'jwt'
	},
	{
		path: `/login/local`,
		method: ['post'],
		pathCallback: authController.login,
		authenticationStrategy:'jwt'
	},
	{
		path: `/confirmEmailAddress`,
		method: ['get'],
		pathCallback: authController.confirmEmailAddress,
		authenticationStrategy:'jwt'
	},
	{
		path: `/forgotPassword`,
		method: ['post'],
		pathCallback: authController.forgotPassword,
		authenticationStrategy:'jwt'
	},
	{
		path: `/resetPassword`,
		method: ['get'],
		pathCallback: authController.resetPassword,
		authenticationStrategy:'jwt'
	},
	{
		path: `/changePassword`,
		method: ['post'],
		pathCallback: authController.changePassword,
		authenticationStrategy:'jwt'
	},
	{
		path: `'/google/googleCb'`,
		method: ['post'],
		pathCallback: authController.googleCbHandler,
		authenticationStrategy:'google'
	}
];

export default authRoutes;
