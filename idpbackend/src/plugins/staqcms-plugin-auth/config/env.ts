import { IAuthEnv } from "../interfaces";

enum PROVIDERS_E {
  LOCAL = "local",
  GOOGLE = "google",
  FACEBOOK = "facebook",
}

enum AUTH_MAIL_TEMPLATES_E {
  EMAIL_VERIFICATION = "email_confirmation",
  FORGOT_PASSWORD = "forgot_password",
  EMAIL_REVERIFICATION = "email_reconfirmation",
  EMAIL_VERIFIED = "email_verified"
}

enum AUTH_EVENT_NAME_E {
  EMAIL_VERIFICATION_EVENT = "email_confirmation_event",
  FORGOT_PASSWORD_EVENT = "forgot_password_event",
  EMAIL_REVERIFICATION_EVENT = "email_reconfirmation_event", //changeEmail
  EMAIL_VERIFIED_EVENT = "email_verified_event"
}

enum SMS_TEMPLATE_NAMES_E {
  OTP_VERIFICATION = "otp_verification",
}



const Environment: IAuthEnv = {
  FACEBOOK_LOGIN: {
    AUTH_URL: "https://graph.facebook.com/v13.0/me",
    PERMISSION_PATH: "/permissions",
  },
}

export { PROVIDERS_E, AUTH_MAIL_TEMPLATES_E, AUTH_EVENT_NAME_E, SMS_TEMPLATE_NAMES_E, Environment }