import { Request, Response } from 'express';

import { AUTH_EMAIL_TEMPLATES } from '../../../AuthEmailTemplates/AuthEmailTemplates';
import { FRONT_END_URL, SERVER_PROPS } from '../../../config';
import { JWT_PROPS } from '../../../config';
import { StaqcmsNodeMailer } from 'staqcms-plugin-nodemailer-gmail';
import { AuthServices } from '../../../plugins/staqcms-plugin-auth/authService';
import {
	AUTH_MAIL_EVENTS_E,
	IAuthServiceResult,
	IConfirmEmailAddress,
	IinitAuthProps,
	ITemplateValue,
	IUserBaseServices
} from '../../../plugins/staqcms-plugin-auth/interfaces';
import UserServices from '../../../extensions/users/services/users.services';

const initAuthProps: IinitAuthProps = {
	authConfig: {
		FRONT_END_URL: FRONT_END_URL,
		JWT_LOGIN_EXPIRES_IN: JWT_PROPS.JWT_LOGIN_EXPIRES_IN,
		JWT_PASSWORD_RESET_EXPIRES_IN: JWT_PROPS.JWT_PASSWORD_RESET_EXPIRES_IN,
		JWT_VERIFICATION_EXPIRES_IN: JWT_PROPS.JWT_VERIFICATION_EXPIRES_IN,
		JWTSecret: JWT_PROPS.JWT_SECRET,
		SERVER_URL: SERVER_PROPS.SERVER_HOST
	},
	mailEventEmitter: (authevent: AUTH_MAIL_EVENTS_E, context: ITemplateValue) => {
		StaqcmsNodeMailer.sendMail(context.toEmail, AUTH_EMAIL_TEMPLATES[authevent], context).catch(
			(sendAuthEmailError: unknown) => {
				console.error(
					'auth_email_event_handler :: handleAuthFunctionEvent :: sendAuthEmailError :: ',
					sendAuthEmailError
				);
			}
		);
	},
	smsEventEmitter: () => {
		return new Promise<void>((resolve, reject) => {
			resolve();
		});
	},
	UserModel: UserServices as unknown as IUserBaseServices,
};

export const authController = {
	getMobileOTP: async (req: Request, res: Response) => {
		let result: IAuthServiceResult = {
			success: false,
			data: null,
			msg: ''
		};

		try {
			let getMobileOTPResult = await new AuthServices(initAuthProps).getMobileOTP(req.body);
			result = getMobileOTPResult;
		} catch (error) {
			console.error(error);
			result.msg = error as string;
		}
		if (result.redirect) {
			return res.status(result.redirect.status).redirect(result.redirect.url);
		} else {
			return res.status(200).json(result);
		}
	},

	changeEmail: async (req: Request, res: Response) => {
		let result: IAuthServiceResult = {
			success: false,
			data: null,
			msg: ''
		};

		try {
			let changeEmailResult = await new AuthServices(initAuthProps).changeEmail(req.body);
			result = changeEmailResult;
		} catch (error) {
			console.error(error);
			result.msg = error as string;
		}
		if (result.redirect) {
			res.send(result.redirect.status).redirect(result.redirect.url);
		} else {
			return res.status(200).json(result);
		}
	},

	validateMobile: async (req: Request, res: Response) => {
		let result: IAuthServiceResult = {
			success: false,
			data: null,
			msg: ''
		};

		try {
			let validateMobileResult = await new AuthServices(initAuthProps).validateMobile(req.body);
			result = validateMobileResult;
		} catch (error) {
			console.error(error);
			result.msg = error as string;
		}
		if (result.redirect) {
			res.send(result.redirect.status).redirect(result.redirect.url);
		} else {
			return res.status(200).json(result);
		}
	},

	register: async (req: Request, res: Response) => {
		let registerResult: IAuthServiceResult = {
			success: false,
			data: null,
			msg: ''
		};

		try {
			let registerServiceResult = await new AuthServices(initAuthProps).register(req.body);
			registerResult = registerServiceResult;
		} catch (error) {
			console.error(error);
			registerResult.msg = error as string;
		}

		return res.status(200).json(registerResult);
	},

	login: async (req: Request, res: Response) => {
		let result: IAuthServiceResult = {
			success: false,
			data: null,
			msg: ''
		};

		try {
			let loginResult = await new AuthServices(initAuthProps).login(req.body);
			result = loginResult;
		} catch (error) {
			console.error(error);
			result.msg = error as string;
		}
		if (result.redirect) {
			res.send(result.redirect.status).redirect(result.redirect.url);
		} else {
			return res.status(200).json(result);
		}
	},

	confirmEmailAddress: async (req: Request, res: Response) => {
		let result: IAuthServiceResult = {
			success: false,
			data: null,
			msg: ''
		};
		const { token } = req.query;
		try {
			let confirmEmailAddressResult = await new AuthServices(initAuthProps).confirmEmailAddress(
				req.query as unknown as IConfirmEmailAddress
			);
			console.log('confirmEmailAddressResult', confirmEmailAddressResult);

			result = confirmEmailAddressResult;
		} catch (error) {
			console.error(error);
			result.msg = error as string;
		}
		if (result.redirect) {
			res.send(result.redirect.status).redirect(result.redirect.url);
		} else {
			return res.status(200).json(result);
		}
	},

	forgotPassword: async (req: Request, res: Response) => {
		let result: IAuthServiceResult = {
			success: false,
			data: null,
			msg: ''
		};

		try {
			let forgotPasswordResult = await new AuthServices(initAuthProps).forgotPassword(req.body);
			result = forgotPasswordResult;
		} catch (error) {
			console.error(error);
			result.msg = error as string;
		}
		if (result.redirect) {
			res.send(result.redirect.status).redirect(result.redirect.url);
		} else {
			return res.status(200).json(result);
		}
	},

	resetPassword: async (req: Request, res: Response) => {
		let result: IAuthServiceResult = {
			success: false,
			data: null,
			msg: ''
		};

		try {
			let resetPasswordResult = await new AuthServices(initAuthProps).resetPassword(req.body);
			result = resetPasswordResult;
		} catch (error) {
			console.error(error);
			result.msg = error as string;
		}
		if (result.redirect) {
			res.send(result.redirect.status).redirect(result.redirect.url);
		} else {
			return res.status(200).json(result);
		}
	},

	changePassword: async (req: Request, res: Response) => {
		let result: IAuthServiceResult = {
			success: false,
			data: null,
			msg: ''
		};

		try {
			let changePasswordResult = await new AuthServices(initAuthProps).changePassword(req.body);
			result = changePasswordResult;
		} catch (error) {
			console.error(error);
			result.msg = error as string;
		}
		if (result.redirect) {
			res.send(result.redirect.status).redirect(result.redirect.url);
		} else {
			return res.status(200).json(result);
		}
	}
};
