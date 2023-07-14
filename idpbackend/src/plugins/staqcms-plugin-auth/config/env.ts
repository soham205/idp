import { IAuthEnv } from '../interfaces';

enum PROVIDERS_E {
	LOCAL = 'local',
	GOOGLE = 'google',
	FACEBOOK = 'facebook'
}

enum SMS_TEMPLATE_NAMES_E {
	OTP_VERIFICATION = 'otp_verification'
}

const Environment: IAuthEnv = {
	FACEBOOK_LOGIN: {
		AUTH_URL: 'https://graph.facebook.com/v13.0/me',
		PERMISSION_PATH: '/permissions'
	}
};

export { PROVIDERS_E, SMS_TEMPLATE_NAMES_E, Environment };
