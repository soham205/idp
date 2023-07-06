import { AUTH_EVENT_NAME_E } from '../config/env';

type JWT_LOGIN_EXPIRES_IN_T = `${number}d`;
type JWT_VERIFICATION_EXPIRES_IN = `${number}h`;
type JWT_PASSWORD_RESET_EXPIRES_IN = `${number}m`;

type MAIL_EVENT_EMITTER_T = (mailEvent: string, context: unknown) => void;
type SMS_EVENT_EMITTER_T = (mobileNumber: string, context: unknown) => Promise<void>;

type ORDER_BY_DIRECTION_T = 'asc' | 'desc';

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
	JWT_LOGIN_EXPIRES_IN: JWT_LOGIN_EXPIRES_IN_T;
	JWT_VERIFICATION_EXPIRES_IN: JWT_VERIFICATION_EXPIRES_IN;
	JWT_PASSWORD_RESET_EXPIRES_IN: JWT_PASSWORD_RESET_EXPIRES_IN;
}

interface IinitAuthProps {
	authConfig: IAuthConfig;
	defaultRoleId: string | number;
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
	fullname: string;
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
}

interface IChangeEmailData {
	email: string;
	newEmail: string;
}

interface IGetMobileOtpData {
	_id: string | number;
	phoneNumber: string;
}

interface IAuthRegisterData {
	_id: string | number;
	fullname: string;
	email: string;
	password: string;
	avtarUrl: string;
	phoneNumber: string;
	password2: string;
}

interface IAuthServices {
	initBaseService: (initAuthBaseServiceProps: IinitAuthProps) => void;
	changeEmail: (changeEmailData: IChangeEmailData) => Promise<IAuthServiceResult>;
	getMobileOTP: (getMobileOptData: IGetMobileOtpData) => Promise<IAuthServiceResult>;
	register: (registerData: IAuthRegisterData, isEmailTriggerRequired?: boolean) => Promise<IAuthServiceResult>;
	facebookLogin: (req: any) => Promise<IAuthServiceResult>;
	encryptUserPassword: (password: string) => Promise<string>;
	isPasswordMatching: (password: string, passwordHash: string) => Promise<boolean>;
	sendMailEvent: (user: IUserElement, emailEvent: AUTH_EVENT_NAME_E) => void;
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
	findOne: (_id: FIND_ALL_FILTER_OPTONS_T) => Promise<IModuleServiceResult>;
	update: (_id: string | number, updateData: any) => Promise<IModuleServiceResult>;
	deleteOne: (_id: string | number) => Promise<IModuleServiceResult>;
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
