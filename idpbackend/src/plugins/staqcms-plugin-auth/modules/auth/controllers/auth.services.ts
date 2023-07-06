import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import axios from 'axios';

import { AUTH_EVENT_NAME_E, Environment, PROVIDERS_E, SMS_TEMPLATE_NAMES_E } from '../../../config/env';
import {
  IAuthConfig,
  IAuthRegisterData,
  IAuthServiceResult,
  IAuthServices,
  IChangeEmailData,
  IGetMobileOtpData,
  IinitAuthProps,
  IRoleElement,
  IUserBaseServices,
  IUserElement,
  MAIL_EVENT_EMITTER_T,
  SMS_EVENT_EMITTER_T
} from '../../../interfaces';
import { registrationValidations } from '../../../utils/validations/registrationValidation';
import { LogError } from 'concurrently';

let User: IUserBaseServices,
  defaultRegisteredRoleId: string | number,
  config: IAuthConfig,
  mailEventEmitter: MAIL_EVENT_EMITTER_T,
  smsEventEmitter: SMS_EVENT_EMITTER_T;

interface ICreateUserData {
  phoneNumber: string;
  email: string;
  newEmail: string;
  phoneOTP: number;
  provider: PROVIDERS_E;
}

function encryptUserPassword(password: string): Promise<string> {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(10, function (err: unknown, salt: string) {
      bcrypt.hash(password, salt, function (err: unknown, hash: string) {
        if (err) {
          reject(err);
        }
        resolve(hash);
      });
    });
  });
}

function isPasswordMatching(password: string, passwordHash: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    bcrypt
      .compare(password, passwordHash)
      .then((result) => {
        if (result) {
          resolve(result);
        } else {
          reject(new Error('Passwords do not match !'));
        }
      })
      .catch((bcryptCompareError) => {
        if (bcryptCompareError) {
          console.error('authService:: isPasswordMatching :: bcryptCompareError ::  ', bcryptCompareError);
          reject(bcryptCompareError);
        }
      });
  });
}

async function sendMailEvent(user: IUserElement, emailEventName: AUTH_EVENT_NAME_E) {
  if (!user) {
    console.error('HANDLED ERROR: no user info found.');
    return;
  }

  // const emailTemplate = getEmailTemplate(emailTemplateName)

  let templateValues;

  switch (emailEventName) {
    case AUTH_EVENT_NAME_E.EMAIL_VERIFICATION_EVENT:
      {
        let token = jwt.sign({ id: String(user.id) }, config.JWTSecret, {
          expiresIn: config.JWT_VERIFICATION_EXPIRES_IN
        });

        templateValues = {
          userName: user.fullname,
          serverUrl: config.SERVER_URL,
          verificationCode: token,
          toEmail: user.email
        };
      }
      break;

    case AUTH_EVENT_NAME_E.EMAIL_VERIFIED_EVENT:
      {
        templateValues = {
          userName: user.fullname,
          frontEndUrl: config.FRONT_END_URL,
          toEmail: user.email
        };
      }
      break;

    case AUTH_EVENT_NAME_E.FORGOT_PASSWORD_EVENT:
      {
        let token = jwt.sign(
          {
            id: String(user.id),
            resetPasswordToken: user.resetPasswordToken
          },
          config.JWTSecret,
          { expiresIn: config.JWT_PASSWORD_RESET_EXPIRES_IN }
        );

        templateValues = {
          userName: user.fullname,
          serverUrl: config.SERVER_URL,
          forgotPasswordToken: token,
          toEmail: user.email
        };
      }
      break;

    default: {
      console.error('No such email template found. Received Email Template Name - ', emailEventName);
      return;
    }
  }

  // mailEventEmitter(emailEventName, templateValues);
}

async function sendSMS(
  user: IUserElement | ICreateUserData,
  smsTemplateName: SMS_TEMPLATE_NAMES_E
): Promise<IAuthServiceResult> {
  return new Promise((resolve, reject) => {
    if (!user) {
      console.error('HANDLED ERROR: no user info found.');
      reject({
        success: false,
        msg: 'no such user info found.'
      });
    }

    // const smsTemplate = getSMSTemplate(smsTemplateName)

    let templateValues: undefined | { mobileOTP: number };

    switch (smsTemplateName) {
      case SMS_TEMPLATE_NAMES_E.OTP_VERIFICATION:
        {
          templateValues = {
            mobileOTP: user.phoneOTP
          };
        }
        break;

      default: {
        console.error('No such SMS template found. Received SMS Template Name - ', smsTemplateName);
        reject({
          success: false,
          msg: 'No such SMS template found. Received SMS Template Name - ',
          smsTemplateName
        });
      }
    }
    if (templateValues) {
      smsEventEmitter(SMS_TEMPLATE_NAMES_E.OTP_VERIFICATION, templateValues)
        .then(async () => {
          // let createdUser = new (user)

          // createdUser = await (<Promise<IUserElement>>createdUser.save())
          const createdUser = await User.create(user);
          if (!(createdUser && createdUser.success && createdUser.data)) {
            return reject(new Error('unable to create user.'));
          }
          console.info('OTP sent to - ', user.phoneNumber, '. Result => ', user.phoneOTP);
          let userLocalVar = <IUserElement>createdUser.data;
          resolve({
            success: true,
            data: { _id: userLocalVar.id },
            msg: ''
          });
        })
        .catch((sendMobileOtpError) => {
          console.error('authServices :: sendSMS ::  sendMobileOtpError :: ', sendMobileOtpError);
          reject(sendMobileOtpError);
        });
    }
  });
}

const verifyFacebookAccessToken = async (accessToken: string) => {
  //TODO: move to constants file
  let response = await axios.get(Environment.FACEBOOK_LOGIN.AUTH_URL, {
    params: {
      access_token: accessToken,
      fields: 'name, picture, email'
    }
  });

  const { data } = response;

  // if (data.error) return null

  return data;
};

const checkFacebookPermissions = async (accessToken: string) => {
  let response = await axios.get(
    `${Environment.FACEBOOK_LOGIN.AUTH_URL}${Environment.FACEBOOK_LOGIN.PERMISSION_PATH}`,
    {
      params: {
        access_token: accessToken
      }
    }
  );

  const { data } = response;
  const permissionsData = data.data;

  let emailPermission = permissionsData.find((permissionItem: any) => permissionItem.permission === 'email');

  return emailPermission.status === 'granted';
};

export const authService: IAuthServices = {
  initBaseService: ({ UserModel, defaultRoleId, authConfig, mailEventEmitter }: IinitAuthProps) => {
    User = UserModel;

    if (defaultRoleId) defaultRegisteredRoleId = defaultRoleId;

    if (authConfig) config = authConfig;

    if (mailEventEmitter) mailEventEmitter = mailEventEmitter;
  },

  changeEmail: async (emailData: IChangeEmailData): Promise<IAuthServiceResult> => {
    try {
      let userData = await User.findByCondition({ email: emailData.email, isDeleted: false });

      let newUserData = await User.findByCondition({ email: emailData.newEmail, isDeleted: false });

      if (newUserData) {
        return {
          success: false,
          msg: 'This email address is already in use!',
          data: null
        };
      }

      if (userData && userData.success && userData.data) {
        let userLocalVar = <IUserElement>userData.data;
        let token = jwt.sign({ id: String(userLocalVar.id), email: emailData.newEmail }, config.JWTSecret, {
          expiresIn: config.JWT_VERIFICATION_EXPIRES_IN
        });

        let fullname = userLocalVar.fullname;

        userLocalVar.newEmail = emailData.newEmail; //update new email into document

        // let updatedData = new User(userData)
        User.update(userLocalVar.id, userLocalVar);
        // updatedData = await updatedData.save()

        let templateValues = {
          userName: fullname,
          serverUrl: config.SERVER_URL,
          verificationCode: token,
          email: userLocalVar.newEmail,
          toEmail: userLocalVar.newEmail
        };

        //change email
        // const emailTemplate = getEmailTemplate(Environment.EMAIL_TEMPLATE_NAME.EMAIL_REVERIFICATION)

        // staqcms_plugin_nodemailer
        //   .sendMail(updatedData.newEmail, emailTemplate, templateValues)
        //   .then((sendMailResult) => {
        //     if (!sendMailResult.success) {
        //       console.error("ERROR: ", sendMailResult.msg)
        //     }
        //     console.info("mail sent -", sendMailResult.data)
        //   })
        //   .catch((error) => {
        //     console.error("ERROR: ", error)
        //   })

        mailEventEmitter(AUTH_EVENT_NAME_E.EMAIL_REVERIFICATION_EVENT, templateValues);
        return {
          success: true,
          data: userLocalVar,
          msg: ''
        };
      } else {
        return {
          success: false,
          msg: `User with email '${emailData.email}' does not exists !`,
          data: null
        };
      }
    } catch (error) {
      console.error(error);
      return {
        success: true,
        data: error,
        msg: error as string
      };
    }
  },

  getMobileOTP: async (registerData: IGetMobileOtpData): Promise<IAuthServiceResult> => {
    let message = '';
    try {
      const { _id, phoneNumber } = registerData;

      let mobileOTP = Math.floor(101010 + Math.random() * 900000);

      console.log('mobileOTP: ', mobileOTP);

      let user = await User.findByCondition({ phoneNumber: phoneNumber });

      //if a user already registered with a phone number but email adress is not registered and is not confirmed yet and cannot use credential to login

      if (user && user.data && user.success) {
        let userLocalVar = <IUserElement>user.data;
        if (userLocalVar.phoneNumber === userLocalVar.email && !userLocalVar.isConfirmed) {
          if (_id && String(userLocalVar.id) !== String(_id)) {
            //delete user
            await User.deleteOne(userLocalVar.id);
            //fetch user by provided _id and update the user variable with the newly fetched user
            user = await User.findByCondition({ _id: _id });
            userLocalVar.phoneNumber = phoneNumber;
          }

          userLocalVar.isPhoneConfirmed = false;
          userLocalVar.phoneOTP = mobileOTP;

          await User.update(userLocalVar.id, userLocalVar);
          // let updatedUser = new User(user)
          // updatedUser = await updatedUser.save()

          return await sendSMS(userLocalVar, SMS_TEMPLATE_NAMES_E.OTP_VERIFICATION);
        }
        /** Checking following case -
         * 1. user enters and verifies phone no. and abondons the registration process.
         * 2. then user logs into system using google or fb login
         * 3. upon successful login, the user will be asked for the phone no.
         * 4. User inputs his phone number which is already registered
         *
         * In this case we need to delete older record provided -
         * 1. Only Phone number and email address are there
         * 2. Phone number and email address are same as phone number
         * 3. Name is not provided.
         * 4. user is not confirmed
         * **/
      }
      //if user with provided phone number exists and frontend has not sent _id as it considers it as fresh registration.
      let userData: IUserElement | ICreateUserData;

      if (user && !_id) {
        return {
          success: false,
          msg: 'User with this phone number already exists.',
          data: null
        };
      } else {
        if (user && user.data && user.success) {
          if (Array.isArray(user.data)) {
            user.data = user.data[0];
          }
          userData = user.data;

          //if user exists with the phone number but the provided _id is not matching
          if (String(userData.id) !== String(_id)) {
            return {
              success: false,
              msg: 'User and phone number are not matching.',
              data: null
            };
          }
          //if user's id and phone number both are matching.
          // user.phoneNumber = phoneNumber
          userData.newPhoneNumber = phoneNumber;
          userData.phoneOTP = mobileOTP;
          userData.provider = PROVIDERS_E.LOCAL;
          // userLocalVar.roles = [defaultRegisteredRoleId]
        } else {
          if (_id) {
            //if !user && _id - If no user with the provided phone number exists but the provided userId exist, change the phone number of the user.
            user = await User.findByCondition({ _id });

            // In case of google login, phone number is email address. In that case, on phone number addition, phone number should be assigned
            if (user && user.data && user.success) {
              userData = <IUserElement>user.data;

              if (userData.phoneNumber === userData.email) {
                userData.phoneNumber = phoneNumber;
              }

              userData.newPhoneNumber = phoneNumber;
              // user.phoneNumber = phoneNumber
              userData.phoneOTP = mobileOTP;
              userData.provider = PROVIDERS_E.LOCAL;
            } else {
              //if there is no user with the phone number and _id is not provided, create the user
              userData = {
                phoneNumber,
                email: phoneNumber,
                newEmail: phoneNumber,
                phoneOTP: mobileOTP,
                provider: PROVIDERS_E.LOCAL
              };
            }
          } else {
            return {
              success: false,
              data: null,
              msg: ''
            };
          }
          return await sendSMS(userData, SMS_TEMPLATE_NAMES_E.OTP_VERIFICATION);
        }
      }
    } catch (error: unknown) {
      console.error(error);
      message = <string>error;
    }
    return {
      success: false,
      msg: message,
      data: null
    };
  },

  register: async (registerData: IAuthRegisterData, isEmailTriggerRequired = true): Promise<IAuthServiceResult> => {
    try {
      const { _id, fullname, email, password, avtarUrl, phoneNumber, password2 } = registerData;

      const registrationError = registrationValidations({ email, fullname, password, password2 });

      if (registrationError.message) {
        console.error('ERROR: ', registrationError);

        return {
          success: false,
          msg: registrationError.message,
          data: null
        };
      }

      let user = await User.findByCondition({ email: email });

      if (user && user.success && user.data && (Array.isArray(user.data) && user.data.length > 0) && !_id) {
        return {
          success: false,
          msg: 'User with this email already exists.',
          data: null
        };
      } else {
        if (user && String(_id) !== String(_id)) {
          return {
            success: false,
            msg: 'User with this email already exists.',
            data: null
          };
        }

        let encryptedPassword = await encryptUserPassword(password);

        if (user && user.data && user.success) {
          if (Array.isArray(user.data) && user.data.length > 0) {
            user.data = user.data[0]
          }
          let userLocalVar = <IUserElement>user.data;
          if (!_id) {
            userLocalVar = {
              ...userLocalVar,
              fullname,
              email,
              newEmail: email,
              avtarUrl: avtarUrl as string,
              provider: PROVIDERS_E.LOCAL,
              password: encryptedPassword,
              roles: [defaultRegisteredRoleId] as string[],
              phoneNumber
            };
            user.data = userLocalVar;
          } else {
            user = await User.findByCondition({ _id });

            if (!user) {
              return {
                success: false,
                msg: 'No such user found.',
                data: null
              };
            }
            userLocalVar.fullname = fullname;
            userLocalVar.email = email;
            userLocalVar.newEmail = email;
            // user.provider = PROVIDERS_E.LOCAL
            userLocalVar.password = encryptedPassword;
            userLocalVar.roles = [defaultRegisteredRoleId] as string[];
          }
          user.data = userLocalVar;
        }
        const createdUser = await User.create(user.data);
        // let createdUser = new User(user);
        // createdUser = await createdUser.save();

        if (!createdUser) {
          console.error('unable to create user.');
          return {
            success: false,
            msg: 'unable to create user.',
            data: null
          };
        }

        if (isEmailTriggerRequired) {
          sendMailEvent(createdUser.data as IUserElement, AUTH_EVENT_NAME_E.EMAIL_VERIFICATION_EVENT);
        }

        return {
          success: true,
          data: createdUser,
          msg: ''
        };
      }
    } catch (error) {
      console.error(error);
      return {
        success: false,
        msg: error as string,
        data: null
      };
    }
  },

  facebookLogin: async (req: any): Promise<IAuthServiceResult> => {
    // TODO change any type.
    try {
      let userToken = req.body && req.body.tokenId ? req.body.tokenId : null;
      let reqSource = req.body.reqSource;

      let isEmailPermissionGranted = await checkFacebookPermissions(userToken);
      if (!isEmailPermissionGranted) {
        return {
          success: false,
          msg: 'Email Address is required for using facebook login.',
          data: null
        };
      }
      let facebookUser = await verifyFacebookAccessToken(userToken);

      if (!facebookUser || !facebookUser.email || facebookUser.error) {
        return {
          success: false,
          msg: facebookUser.error || 'Could not login using facebook',
          data: null
        };
      }

      const userDataSet = {
        isConfirmed: true,
        provider: PROVIDERS_E.FACEBOOK
      };

      const userDataInsert = {
        email: facebookUser.email,
        fullname: facebookUser.name,
        newEmail: facebookUser.email,
        phoneNumber: facebookUser.email,
        isEmailTriggerRequired: false,
        avatar_url: facebookUser.picture.data.url
      };

      let token;

      let user = await User.update(facebookUser.email, userDataSet);

      if (!(user && user.success && user.data)) {
        return {
          success: true,
          data: token,
          msg: ''
        };
      }
      let userData = user.data as IUserElement;
      let roles = userData.roles as IRoleElement[];
      const userRoles = roles.map((roleItem: IRoleElement) => roleItem.name);

      token = jwt.sign(
        {
          id: userData.id,
          fullname: userData.fullname,
          roles: userRoles,
          reqSource,
          sessionId: req.session.id
        },
        config.JWTSecret,
        {
          expiresIn: config.JWT_VERIFICATION_EXPIRES_IN
        }
      );

      if (!req.session.user) {
        req.session.user = token;
      }

      return {
        success: true,
        data: token,
        msg: ''
      };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        msg: error as string,
        data: null
      };
    }
  },

  encryptUserPassword: (password: string) => {
    return encryptUserPassword(password);
  },

  isPasswordMatching: (password: string, passwordHash: string) => {
    return isPasswordMatching(password, passwordHash);
  },
  sendMailEvent: (user: IUserElement, emailEvent: AUTH_EVENT_NAME_E) => {
    return sendMailEvent(user, emailEvent);
  }
};
