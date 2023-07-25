import { IEmailTemplate } from 'staqcms-plugin-nodemailer-gmail/lib/interfaces';

type EXPIRATION_DURATION_TYPE_T = 'm' | 'h' | 'd' | 'mo' | 'y';
type JWT_TIME_EXPIRATION_T = `${number}${EXPIRATION_DURATION_TYPE_T}`;

type MAIL_EVENT_EMITTER_T = (mailEvent: AUTH_MAIL_EVENTS_E, context: ITemplateValue) => void;
type SMS_EVENT_EMITTER_T = (mobileNumber: string, context: unknown) => Promise<void>;

interface IFaceBookLoginProps {
	AUTH_URL: string;
	PERMISSION_PATH: string;
}

interface IAuthEnv {
	FACEBOOK_LOGIN: IFaceBookLoginProps;
}

interface IAuthConfig {
	SERVER_URL: string;
	FRONT_END_URL: string;
	JWTSecret: string;
	JWT_LOGIN_EXPIRES_IN: JWT_TIME_EXPIRATION_T;
	JWT_VERIFICATION_EXPIRES_IN: JWT_TIME_EXPIRATION_T;
	JWT_PASSWORD_RESET_EXPIRES_IN: JWT_TIME_EXPIRATION_T;
}

interface IinitAuthProps {
	authConfig: IAuthConfig;
	UserModel: IUserBaseServices;
	mailEventEmitter: MAIL_EVENT_EMITTER_T;
	smsEventEmitter: SMS_EVENT_EMITTER_T;
}

interface IRoleElement {
	id: string | number;
	name: string;
	slug: string;
	description: string;
}

interface IUserElement {
	id: string | number;
	fullName: string;
	email: string;
	newEmail: string;
	phoneNumber: string;
	newPhoneNumber?: string;
	password: string;
	avtarUrl: string;
	isConfirmed: boolean;
	isPhoneConfirmed: boolean;
	phoneOTP: number;
	resetPasswordToken: string | null;
	isPasswordReset: boolean;
	provider: string;
	isDeleted: boolean;
	roles: IRoleElement[] | string[] | number[];
	updatedAt: string;
}

interface IAuthServiceResult {
	success: boolean;
	data: unknown;
	msg: string;
	redirect?:
		| {
				url: string;
				status: number;
		  }
		| undefined;
}

interface IChangeEmailData {
	email: string;
	newEmail: string;
}

interface IGetMobileOtpData {
	id: string | number;
	phoneNumber: string;
}

interface IAuthRegisterData {
	id?: string | number;
	fullName: string;
	email: string;
	password: string;
	avtarUrl?: string;
	phoneNumber?: string;
	password2: string;
}

export interface ITemplateValue {
	toEmail: string;
	[key: string]: string | number | boolean;
}

export enum AUTH_MAIL_EVENTS_E {
	EMAIL_CONFIRMATION_EVENT = 'email_confirmation_event',
	EMAIL_VERIFIED_EVENT = 'email_verified_event',
	FORGOT_PASSWORD_EVENT = 'forgot_password_event',
	EMAIL_RECONFIRMATION_EVENT = 'email_reconfirmation_event',
	EMAIL_REGISTERED = 'email_registered'
}

export type AUTH_TEMPLATES_T = {
	[key in AUTH_MAIL_EVENTS_E]: IEmailTemplate;
};

export interface ILoginServiceProps {
	password: string;
	email: string;
	reqSource?: string;
	token?: string;
	user?: IUserElement;
	sessionId?: string;
}

export interface IValidateMobile {
	id: string;
	phoneOTP: number;
}

export interface IConfirmEmailAddress {
	token: string;
}

export interface IForgotPassword {
	email: string;
}

export interface IResetPassword {
	token: string;
}
export interface IChangePassword {
	oldPassword: string;
	resetPasswordToken: string;
	password: string;
	password2: string;
	token?: string
}

interface IAuthServices {
	/**
	 *  All of the configurations props
	 * 
	 */
	// authConfig: IAuthConfig;
	// defaultRoleId: string | number;
	// UserModel: IUserBaseServices;
	// mailEventEmitter: MAIL_EVENT_EMITTER_T;
	// smsEventEmitter: SMS_EVENT_EMITTER_T;

	/**
	 * Auth services methos
	 *  
	 */
	changeEmail: (changeEmailData: IChangeEmailData) => Promise<IAuthServiceResult>;
	getMobileOTP: (getMobileOptData: IGetMobileOtpData) => Promise<IAuthServiceResult>;
	register: (registerData: IAuthRegisterData, isEmailTriggerRequired?: boolean) => Promise<IAuthServiceResult>;
	login: (loginProps: ILoginServiceProps) => Promise<IAuthServiceResult>;
	sendMailEvent: (user: IUserElement, emailEvent: AUTH_MAIL_EVENTS_E) => void;
	validateMobile: (validateMobileOtpInput: IValidateMobile) => Promise<IAuthServiceResult>;
	confirmEmailAddress: (confirmEmailAddressInput: IConfirmEmailAddress) => Promise<IAuthServiceResult>;
	forgotPassword: (forgotPasswordInput: IForgotPassword) => Promise<IAuthServiceResult>;
	resetPassword: (resetPasswordInput: IResetPassword) => Promise<IAuthServiceResult>;
	changePassword: (changePasswordInput: IChangePassword) => Promise<IAuthServiceResult>;
}

type FIND_ALL_FILTER_OPTONS_T = {
	[kye in string]: string | number | boolean;
};

interface IModuleServiceResult {
	data: IUserElement | IUserElement[] | null;
	message: string | null;
	success: boolean;
}

interface IUserBaseServices {
	create: (createData: any) => Promise<IModuleServiceResult>;
	findAll: (findAllFilterOptions?: FIND_ALL_FILTER_OPTONS_T) => Promise<IModuleServiceResult>;
	findOne: (id: FIND_ALL_FILTER_OPTONS_T) => Promise<IModuleServiceResult>;
	update: (id: string | number, updateData: any) => Promise<IModuleServiceResult>;
	deleteOne: (id: string | number) => Promise<IModuleServiceResult>;
	deleteAll: () => Promise<IModuleServiceResult>;
	findByCondition: (condition: FIND_ALL_FILTER_OPTONS_T) => Promise<IModuleServiceResult>;
}

export {
	IinitAuthProps,
	IAuthEnv,
	MAIL_EVENT_EMITTER_T,
	SMS_EVENT_EMITTER_T,
	IUserElement,
	IRoleElement,
	IAuthConfig,
	IAuthServiceResult,
	IChangeEmailData,
	IGetMobileOtpData,
	IAuthRegisterData,
	IAuthServices,
	IUserBaseServices,
	IModuleServiceResult
};
