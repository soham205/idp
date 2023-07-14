import {
	AUTH_MAIL_EVENTS_E,
	IAuthConfig,
	IAuthRegisterData,
	IAuthServiceResult,
	IAuthServices,
	IChangeEmailData,
	IChangePassword,
	IConfirmEmailAddress,
	IForgotPassword,
	IGetMobileOtpData,
	IinitAuthProps,
	ILoginServiceProps,
	IModuleServiceResult,
	IResetPassword,
	IRoleElement,
	ITemplateValue,
	IUserBaseServices,
	IUserElement,
	IValidateMobile,
	MAIL_EVENT_EMITTER_T,
	SMS_EVENT_EMITTER_T
} from '../interfaces';

import moment from 'moment';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { commonUtils } from '../utils/commonUtils';
import { IError } from '../utils/validations/errorInterfaces';
import { frontEndConnections } from '../utils/frontEndConnection';
import { Environment, PROVIDERS_E, SMS_TEMPLATE_NAMES_E } from '../config/env';
import { validateEmail } from '../utils/validations/_emailValidation';
import { loginValidation } from '../utils/validations/loginValidation';
import { validatePasswords } from '../utils/validations/_passwordsValidation';
import { encryptUserPassword, isPasswordMatching } from '../utils/authServiceUtils';
import { registrationValidations } from '../utils/validations/registrationValidation';
import { ICreateUserData } from '../../../plugins/staqcms-plugin-user-role/interfaces/userinterface';

const MOBILE_OTP_VALIDITY_MINUTES = 15;

function getDecodedTokenContents(token: string, JWTSecret: string) {
	return new Promise((resolve, reject) => {
		jwt.verify(token, JWTSecret, async function (error, decoded_token: string | jwt.JwtPayload | undefined) {
			if (error) {
				reject(error);
			} else {
				resolve(decoded_token);
			}
		});
	});
}

async function sendSMSUtil(
	user: IUserElement | ICreateUserData,
	smsTemplateName: SMS_TEMPLATE_NAMES_E,
	smsEventEmitter: SMS_EVENT_EMITTER_T,
	UserModel: IUserBaseServices
): Promise<void> {
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
				.then(() => {
					resolve();
				})
				.catch((sendMobileOtpError) => {
					console.error('authServices :: sendSMS ::  sendMobileOtpError :: ', sendMobileOtpError);
					reject(sendMobileOtpError);
				});
		}
	});
}

export class AuthServices implements IAuthServices {
	protected authConfig: IAuthConfig;
	private UserModel: IUserBaseServices;
	private mailEventEmitter: MAIL_EVENT_EMITTER_T;
	private smsEventEmitter: SMS_EVENT_EMITTER_T;

	private changeEmailUtil = async (emailData: IChangeEmailData) => {
		try {
			let userData = await this.UserModel.findByCondition({ email: emailData.email, isDeleted: false });

			let newUserData = await this.UserModel.findByCondition({ email: emailData.newEmail, isDeleted: false });

			if (newUserData) {
				return {
					success: false,
					msg: 'This email address is already in use!',
					data: null
				};
			}

			if (userData && userData.success && userData.data) {
				let userLocalVar = <IUserElement>userData.data;
				let token = jwt.sign({ id: String(userLocalVar.id), email: emailData.newEmail }, this.authConfig.JWTSecret, {
					expiresIn: this.authConfig.JWT_VERIFICATION_EXPIRES_IN
				});

				let fullName = userLocalVar.fullName;

				userLocalVar.newEmail = emailData.newEmail; //update new email into document

				this.UserModel.update(userLocalVar.id, userLocalVar);

				let templateValues = {
					userName: fullName,
					serverUrl: this.authConfig.SERVER_URL,
					verificationCode: token,
					email: userLocalVar.newEmail,
					toEmail: userLocalVar.newEmail
				};

				this.mailEventEmitter(AUTH_MAIL_EVENTS_E.EMAIL_RECONFIRMATION_EVENT, templateValues);
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
	};

	private registerUtil = async (
		registerData: IAuthRegisterData,
		isEmailTriggerRequired = true
	): Promise<IAuthServiceResult> => {
		try {
			const { id, fullName, email, password, avtarUrl, phoneNumber, password2 } = registerData;

			const registrationError = registrationValidations({ email, fullName, password, password2 });

			if (registrationError.message) {
				console.error('ERROR: ', registrationError);
				return {
					success: false,
					msg: registrationError.message,
					data: null
				};
			}

			let userServiceResult = await this.UserModel.findByCondition({ email: email });
			let user = userServiceResult.data;

			if (user && !id) {
				return {
					success: false,
					msg: 'User with this email already exists.',
					data: null
				};
			} else {
				if (user && String(id) !== String(id)) {
					return {
						success: false,
						msg: 'User with this email already exists.',
						data: null
					};
				}

				let encryptedPassword = await encryptUserPassword(password);

				if (!id) {
					let createUserData = {
						fullName: fullName,
						email,
						newEmail: email,
						avtarUrl: avtarUrl as string,
						provider: PROVIDERS_E.LOCAL,
						password: encryptedPassword,
						phoneNumber
					};
					await this.UserModel.create(createUserData);
				} else {
					let userFindServiceResult = await this.UserModel.findByCondition({ id });

					if (!(userFindServiceResult && userFindServiceResult.data && userFindServiceResult.success)) {
						return {
							success: false,
							msg: 'No such user found.',
							data: null
						};
					}
					let userElement = userFindServiceResult.data as IUserElement;
					await this.UserModel.update(userElement.id, {
						fullName,
						email,
						provider: PROVIDERS_E.LOCAL,
						password: encryptedPassword
					});
				}

				const userCreateResult = await this.UserModel.findByCondition({ email });
				if (isEmailTriggerRequired) {
					this.sendMailEventUtil(userCreateResult.data as IUserElement, AUTH_MAIL_EVENTS_E.EMAIL_CONFIRMATION_EVENT);
				}
				return {
					success: true,
					data: userCreateResult.data,
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
	};

	getMobileOTPUtil = async (registerData: IGetMobileOtpData): Promise<IAuthServiceResult> => {
		try {
			const { id, phoneNumber } = registerData;

			let mobileOTP = Math.floor(101010 + Math.random() * 900000);

			console.log('mobileOTP: ', mobileOTP);

			let userFindServiceResult = await this.UserModel.findOne({ phoneNumber: phoneNumber });
			let user = userFindServiceResult.data as IUserElement;
			//if a user already registered with a phone number but email adress is not registered and is not confirmed yet and cannot use credential to login
			if (user && user.phoneNumber === user.email && !user.isConfirmed) {
				// Till user confims the opt. isPhoneConfirmed flag will be false and mobile otp will be stored in user element.
				user.isPhoneConfirmed = false;
				user.phoneOTP = mobileOTP;

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

				if (id && String(user.id) !== String(id)) {
					//delete existing user in the db
					await this.UserModel.deleteOne(user.id);

					//fetch user by provided _id and update the user variable with the newly fetched user
					const userSerivceResult = await this.UserModel.findByCondition({ id: id });
					if (userSerivceResult && userSerivceResult.data && userSerivceResult.success) {
						user = { ...(userSerivceResult.data as IUserElement) };
					}

					await sendSMSUtil(user, SMS_TEMPLATE_NAMES_E.OTP_VERIFICATION, this.smsEventEmitter, this.UserModel);
					await this.UserModel.update(user.id, user);
				}
			}
			//if user with provided phone number exists and frontend has not sent _id as it considers it as fresh registration.

			if (user && !id) {
				return {
					success: false,
					msg: 'User with this phone number already exists.',
					data: null
				};
			} else {
				if (user) {
					if (String(user.id) !== String(id)) {
						return {
							success: false,
							msg: 'User and phone number are not matching.',
							data: null
						};
					}
					//if user's id and phone number both are matching.
					// user.phoneNumber = phoneNumber

					user.newPhoneNumber = phoneNumber;
					user.phoneOTP = mobileOTP;
					user.provider = PROVIDERS_E.LOCAL;

					await sendSMSUtil(user, SMS_TEMPLATE_NAMES_E.OTP_VERIFICATION, this.smsEventEmitter, this.UserModel);
					await this.UserModel.update(user.id, { ...user });
				} else {
					if (id) {
						//if !user && _id - If no user with the provided phone number exists but the provided userId exist, change the phone number of the user.
						let userFindServiceReult = await this.UserModel.findOne({ id });
						user = userFindServiceReult.data as IUserElement;
						// In case of google login, phone number is email address. In that case, on phone number addition, phone number should be assigned
						if (user.phoneNumber === user.email) {
							user.phoneNumber = phoneNumber;
						}
						user.newPhoneNumber = phoneNumber;
						user.phoneOTP = mobileOTP;
						user.provider = PROVIDERS_E.LOCAL;

						await sendSMSUtil(user, SMS_TEMPLATE_NAMES_E.OTP_VERIFICATION, this.smsEventEmitter, this.UserModel);
						await this.UserModel.update(user.id, { ...user });
					} else {
						let createUserData = {
							phoneNumber,
							email: phoneNumber,
							newEmail: phoneNumber,
							phoneOTP: mobileOTP,
							provider: PROVIDERS_E.LOCAL
						};

						await sendSMSUtil(user, SMS_TEMPLATE_NAMES_E.OTP_VERIFICATION, this.smsEventEmitter, this.UserModel);
						await this.UserModel.create(createUserData);
					}
				}
			}

			return {
				success: true,
				data: null,
				msg: ''
			};
		} catch (error) {
			return {
				data: null,
				success: false,
				msg: error as string
			};
		}
	};

	private validateMobileUtil = async ({ id, phoneOTP }: IValidateMobile): Promise<IAuthServiceResult> => {
		try {
			if (phoneOTP) {
				let user: IModuleServiceResult | IUserElement = await this.UserModel.findByCondition({
					id
				});

				if (user && user.success && user.data) {
					if (Array.isArray(user.data)) {
						user.data = user.data[0];
					}
					user = user.data;
					if (
						moment(user.updatedAt).add(MOBILE_OTP_VALIDITY_MINUTES, 'minutes').toDate().getTime() > new Date().getTime()
					) {
						if (phoneOTP == user.phoneOTP) {
							user.isPhoneConfirmed = true;
							user.phoneOTP = 0;

							if (user.newPhoneNumber && user.newPhoneNumber !== '') {
								user.phoneNumber = user.newPhoneNumber;
								delete user.newPhoneNumber;
							}

							await this.UserModel.update(user.id, user);
							return {
								success: true,
								data: null,
								msg: ''
							};
						} else {
							// return commonUtils.sendResponse(res, 200, false, null, 'OTP does not match.');
							return {
								success: false,
								data: null,
								msg: 'OTP does not match.'
							};
						}
					} else {
						// return commonUtils.sendResponse(res, 200, false, null, 'OTP expired. Please try again');
						return {
							success: false,
							data: null,
							msg: 'OTP expired. Please try again'
						};
					}
				} else {
					// return commonUtils.sendResponse(res, 200, false, null, 'User with id - ' + id + ' - not found');
					return {
						success: false,
						data: null,
						msg: 'User with id - ' + id + ' - not found'
					};
				}
			} else {
				// return commonUtils.sendResponse(res, 200, false, null, 'OTP is required to proceed');
				return {
					success: false,
					data: null,
					msg: 'OTP is required to proceed'
				};
			}
		} catch (error) {
			console.error(error);
			// return commonUtils.sendResponse(res, 200, false, null, error as string);
			return {
				success: false,
				data: null,
				msg: error as string
			};
		}
	};

	private loginUtil = async ({
		email,
		password,
		reqSource,
		sessionId,
		token,
		user
	}: ILoginServiceProps): Promise<IAuthServiceResult> => {
		try {
			//TODO: Document token requirement
			// const { password, email, reqSource, token } = req.body;

			const loginError = loginValidation({ email, password, token });

			if (loginError?.message) {
				console.error('ERROR: ', loginError);
				// return commonUtils.sendResponse(res, 200, false, null, loginError.message);
				return {
					success: false,
					data: null,
					msg: loginError.message
				};
			}

			let user: undefined | IUserElement | IModuleServiceResult;
			let sessionIdResult;

			if (token) {
				try {
					let decoded_token = await commonUtils.jwtVerify(String(token), this.authConfig.JWTSecret);
					if (
						typeof decoded_token !== 'string' &&
						decoded_token &&
						decoded_token.exp &&
						decoded_token.exp > new Date().getTime() / 1000
					) {
						// Getting user details along with roles. To be implemented in all.
						let userFindOneResult = await this.UserModel.findByCondition({ id: decoded_token.id });
						if (userFindOneResult && userFindOneResult.success && userFindOneResult.data) {
							if (Array.isArray(userFindOneResult.data)) {
								userFindOneResult.data = userFindOneResult.data[0];
							}
							user = userFindOneResult.data;
						}

						sessionIdResult = decoded_token.sessionId;
					} else {
						// return commonUtils.sendResponse(res, 200, false, null, 'Token expired! Login again to access.');
						return {
							data: null,
							success: false,
							msg: 'Token expired! Login again to access.'
						};
					}
				} catch (error) {
					console.error(error);
					// return res.status(400).redirect(frontEndConnections.getBadRequestLink());
					return {
						data: null,
						success: false,
						msg: '',
						redirect: {
							status: 400,
							url: frontEndConnections.getBadRequestLink()
						}
					};
				}
			} else {
				user = await this.UserModel.findByCondition({ email });
				if (user && user.success && user.data) {
					if (Array.isArray(user.data)) {
						user.data = user.data[0];
					}
					user = user.data;
				} else {
					user = undefined;
				}
			}
			if (!user) {
				console.error('ERROR: No such user found - ', email);
				// return commonUtils.sendResponse(res, 200, false, null, 'Invalid email address or password.');
				return {
					success: false,
					data: null,
					msg: 'Invalid email address or password.'
				};
			}
			let userLocalVar = <IUserElement>user;

			if (userLocalVar) {
				let isUserAuthorized;
				if (token) {
					isUserAuthorized = true;
				} else {
					try {
						let matchResult = await isPasswordMatching(password, userLocalVar.password);
						isUserAuthorized = matchResult;
					} catch (error) {}
				}

				let userRoleArray = <IRoleElement[]>userLocalVar.roles;
				const userRoles = userRoleArray.map((role: IRoleElement) => role.name);

				if (isUserAuthorized) {
					if (!token && reqSource === 'sso' && sessionId) {
						sessionIdResult = sessionId;
					}

					let userToken = jwt.sign(
						{
							id: userLocalVar.id,
							fullName: userLocalVar.fullName,
							roles: userRoles,
							reqSource,
							sessionIdResult
						},
						this.authConfig.JWTSecret,
						{
							expiresIn: this.authConfig.JWT_LOGIN_EXPIRES_IN
						}
					);

					// if (reqSource === 'sso' && req.session && req.session.user) {
					// 	let decoded_session_token = await commonUtils.jwtVerify(String(req.session.user), config.JWTSecret);

					// 	if (
					// 		decoded_session_token &&
					// 		typeof decoded_session_token !== 'string' &&
					// 		String(decoded_session_token.id) !== String(userLocalVar.id)
					// 	) {
					// 		// return commonUtils.sendResponse(res, 200, true, { action: 'login_again' }, '');
					// 	}

					// 	userToken = req.session.user;
					// }

					userLocalVar.provider = PROVIDERS_E.LOCAL;

					// if (reqSource === 'sso' && !req.session.user) {
					// 	req.session.user = userToken;
					// }
					await this.UserModel.update(userLocalVar.id, userLocalVar);
					// return commonUtils.sendResponse(res, 200, true, userToken, '');
					return {
						success: true,
						data: userToken,
						msg: ''
					};
					//TODO : rewrite save
					// user.save(() => {
					// })
				} else {
					// return commonUtils.sendResponse(res, 200, false, null, 'Incorrect email or password.');
					return {
						success: false,
						data: null,
						msg: 'Incorrect email or password.'
					};
				}
			} else {
				console.error(
					'Your Email Address is not verified yet. Please open the link sent on your email to verify first.'
				);

				return {
					success: false,
					data: null,
					msg: 'Your Email Address is not verified yet. Please open the link sent on your email to verify first.'
				};
			}
		} catch (error) {
			console.error(error);
			// return commonUtils.sendResponse(res, 200, false, null, error as string);
			return {
				success: false,
				data: null,
				msg: error as string
			};
		}
	};

	private confirmEmailAddressUtil = async ({ token }: IConfirmEmailAddress): Promise<IAuthServiceResult> => {
		try {
			if (typeof token === 'string' && token) {
				let decoded_token = (await getDecodedTokenContents(token, this.authConfig.JWTSecret)) as jwt.JwtPayload;
				let decodedTokenLocalVar: jwt.JwtPayload | undefined | string = decoded_token as jwt.JwtPayload;

				if (!decoded_token && typeof token === 'string') {
					let decodedResult = jwt.decode(token);
					if (decodedResult && typeof decodedResult !== 'string') {
						decodedTokenLocalVar = decodedResult;
					}
				}

				let userFindServiceResult = await this.UserModel.findByCondition({
					id: decodedTokenLocalVar && decodedTokenLocalVar.id ? decodedTokenLocalVar.id : null
				});

				if (userFindServiceResult && userFindServiceResult.success && userFindServiceResult.data) {
					let user = userFindServiceResult.data as IUserElement;
					if (
						decoded_token &&
						typeof decoded_token !== 'string' &&
						decoded_token.exp &&
						decoded_token.exp > new Date().getTime() / 1000
					) {
						if (decoded_token.email && decoded_token.email !== user.newEmail) {
							return {
								success: false,
								data: null,
								msg: '',
								redirect: {
									url: frontEndConnections.getBadRequestLink(),
									status: 400
								}
							};
						}
						user.isConfirmed = true;
						if (user.newEmail && decoded_token.email && user.newEmail === decoded_token.email) {
							user.email = user.newEmail;
						}

						try {
							console.log('972');

							await this.UserModel.update(user.id, user);
							console.log('975');

							this.sendMailEventUtil(user, AUTH_MAIL_EVENTS_E.EMAIL_VERIFIED_EVENT);
							console.log('974');

							return {
								success: true,
								data: null,
								msg: '',
								redirect: {
									url: frontEndConnections.getEmailVerificationSuccessLink(user.fullName),
									status: 200
								}
							};
						} catch (error) {
							console.error(error);
							return {
								success: false,
								data: null,
								msg: 'Something went wrong. Please try after sometime.',
								redirect: {
									url: frontEndConnections.getBadRequestLink(),
									status: 200
								}
							};
						}
					} else {
						throw new Error('TokenExpiredError');
					}
				} else {
					console.error('User with id - ' + JSON.stringify(decoded_token) + ' - not found');
					return {
						success: false,
						data: null,
						msg: 'Something went wrong. Please try after sometime.',
						redirect: {
							url: frontEndConnections.getEmailVerificationLinkExpiredLink(frontEndConnections.getBadRequestLink()),
							status: 400
						}
					};
				}
			} else {
				console.error('Token is missing in the url');
				return {
					success: false,
					data: null,
					msg: 'Something went wrong. Please try after sometime.',
					redirect: {
						url: frontEndConnections.getEmailVerificationLinkExpiredLink(frontEndConnections.getBadRequestLink()),
						status: 400
					}
				};
			}
		} catch (error: any) {
			if (error.name !== 'TokenExpiredError') {
				return {
					success: false,
					data: null,
					msg: error as string,
					redirect: {
						url: frontEndConnections.getBadRequestLink(),
						status: 400
					}
				};
			} else {
				return {
					success: false,
					data: null,
					msg: 'Something went wrong. Please try after sometime.',
					redirect: {
						url: frontEndConnections.getEmailVerificationLinkExpiredLink(''),
						status: 200
					}
				};
			}
		}
	};

	private forgotPasswordUtil = async ({ email }: IForgotPassword): Promise<IAuthServiceResult> => {
		try {
			const emailError = validateEmail(email);

			if (emailError) {
				console.error('ERROR: ', emailError);
				// return commonUtils.sendResponse(res, 200, false, null, emailError.message);
				return {
					success: false,
					data: null,
					msg: emailError.message
				};
			}

			email = email.toLowerCase();

			let user = await this.UserModel.findByCondition({
				email: email
			});

			if (!(user && user.success && user.data)) {
				// return commonUtils.sendResponse(res, 200, false, null, 'This email does not exist.');
				return {
					success: false,
					data: null,
					msg: 'This email does not exist.'
				};
			}
			if (Array.isArray(user.data)) {
				user.data = user.data[0];
			}
			let userLocalVar = user.data;
			// Generate random token.
			const resetPasswordToken = crypto.randomBytes(64).toString('hex');

			// Set the property code.
			userLocalVar.resetPasswordToken = resetPasswordToken;

			// user = await user.save();
			await this.UserModel.update(userLocalVar.id, userLocalVar);

			this.sendMailEventUtil(userLocalVar, AUTH_MAIL_EVENTS_E.FORGOT_PASSWORD_EVENT);
			// return commonUtils.sendResponse(res, 200, true, null, '');
			return {
				success: true,
				data: null,
				msg: ''
			};
		} catch (error) {
			console.error(error);
			// return commonUtils.sendResponse(res, 200, false, null, error as string);
			return {
				success: false,
				data: null,
				msg: error as string
			};
		}
	};

	private resetPasswordUtil = async ({ token }: IResetPassword): Promise<IAuthServiceResult> => {
		try {
			if (token && typeof token === 'string') {
				let decodedTokenLocalVar: jwt.JwtPayload | undefined;
				let decoded_token = (await getDecodedTokenContents(token, this.authConfig.JWTSecret)) as jwt.JwtPayload;

				if (!decoded_token && typeof token === 'string') {
					let decodeTokenResult = jwt.decode(token);
					if (decodeTokenResult && typeof decodeTokenResult !== 'string') {
						decodedTokenLocalVar = decodeTokenResult;
					}
				}

				let user = await this.UserModel.findByCondition({
					id: decodedTokenLocalVar && decodedTokenLocalVar.id ? decodedTokenLocalVar.id : null
				});

				if (user && user.success && user.data) {
					if (
						decoded_token &&
						typeof decoded_token !== 'string' &&
						decoded_token.exp &&
						decoded_token.exp > new Date().getTime() / 1000
					) {
						// res.redirect(frontEndConnections.getResetPasswordLink(token as string, []));
						return {
							success: false,
							data: null,
							msg: '',
							redirect: {
								url: frontEndConnections.getResetPasswordLink(token as string, []),
								status: 400
							}
						};
					} else {
						// return res.redirect(frontEndConnections.getResetPasswordLinkExpiredLink());
						return {
							success: false,
							data: null,
							msg: '',
							redirect: {
								url: frontEndConnections.getResetPasswordLinkExpiredLink(),
								status: 400
							}
						};
					}
				} else {
					console.error('User with id - ' + decodedTokenLocalVar + ' - not found');
					// return res.status(400).redirect(frontEndConnections.getBadRequestLink());
					return {
						success: false,
						data: null,
						msg: '',
						redirect: {
							url: frontEndConnections.getBadRequestLink(),
							status: 400
						}
					};
				}
			} else {
				console.error('Token is missing in the resetPassword url');
				// return res.status(400).redirect(frontEndConnections.getBadRequestLink());
				return {
					success: false,
					data: null,
					msg: '',
					redirect: {
						url: frontEndConnections.getBadRequestLink(),
						status: 400
					}
				};
			}
		} catch (error: any) {
			if (error.name != 'TokenExpiredError') {
				return {
					success: false,
					data: null,
					msg: 'Something went wrong. Please try after sometime.',
					redirect: {
						url: frontEndConnections.getBadRequestLink(),
						status: 400
					}
				};
			} else {
				console.error(error);
				// return commonUtils.sendResponse(res, 200, false, null, error as string);
				return {
					success: false,
					data: null,
					msg: error as string
				};
			}
		}
	};

	private changePasswordUtil = async ({
		oldPassword,
		resetPasswordToken,
		password,
		password2,
		token
	}: IChangePassword): Promise<IAuthServiceResult> => {
		try {
			if (resetPasswordToken && typeof resetPasswordToken === 'string') {
				let decoded_token = (await getDecodedTokenContents(
					resetPasswordToken,
					this.authConfig.JWTSecret
				)) as jwt.JwtPayload;

				let localDecodedTokenVar: jwt.JwtPayload | undefined;
				if (!decoded_token) {
					let decodedTokenResult = jwt.decode(resetPasswordToken);
					if (decodedTokenResult && typeof decodedTokenResult !== 'string') {
						localDecodedTokenVar = decodedTokenResult;
					}
				}

				let user = await this.UserModel.findByCondition({
					id: localDecodedTokenVar && localDecodedTokenVar.id ? localDecodedTokenVar.id : null
				});

				if (user && user.success && user.data) {
					if (Array.isArray(user.data)) {
						user.data = user.data[0];
					}
					let userLocalvar = user.data;
					if (
						decoded_token &&
						typeof decoded_token !== 'string' &&
						decoded_token.exp &&
						decoded_token.exp > new Date().getTime() / 1000
					) {
						if (decoded_token.resetPasswordToken === userLocalvar.resetPasswordToken) {
							let passwordsError: undefined | IError | string = validatePasswords(password, password2);

							if (passwordsError) {
								passwordsError = encodeURIComponent(JSON.stringify(passwordsError));
								// res.redirect(frontEndConnections.getResetPasswordLink(resetPasswordToken, passwordsError));
								return {
									success: false,
									data: null,
									msg: '',
									redirect: {
										url: frontEndConnections.getResetPasswordLink(resetPasswordToken, passwordsError),
										status: 400
									}
								};
							} else {
								let encryptedPassword = await encryptUserPassword(password);

								// let newUser = new User(user);

								userLocalvar.password = encryptedPassword;
								userLocalvar.provider = PROVIDERS_E.LOCAL;
								userLocalvar.isPasswordReset = false;
								userLocalvar.resetPasswordToken = null;

								// await newUser.save();

								// res.redirect(frontEndConnections.getResetPasswordSuccessLink(userLocalvar.fullName));
								return {
									success: false,
									data: null,
									msg: '',
									redirect: {
										url: frontEndConnections.getResetPasswordSuccessLink(userLocalvar.fullName),
										status: 400
									}
								};
							}
						} else {
							let errors: string | [{ type: string; msg: string }] = [
								{ type: 'resetPasswordToken', msg: 'No request to reset password found.' }
							];

							errors = JSON.stringify(errors);
							errors = encodeURIComponent(errors);
							// res.redirect(frontEndConnections.getResetPasswordLink(resetPasswordToken, errors));
							return {
								success: false,
								data: null,
								msg: '',
								redirect: {
									url: frontEndConnections.getResetPasswordLink(resetPasswordToken, errors),
									status: 400
								}
							};
						}
					} else {
						// return res.redirect(frontEndConnections.getResetPasswordLinkExpiredLink());
						return {
							success: false,
							data: null,
							msg: '',
							redirect: {
								url: frontEndConnections.getResetPasswordLinkExpiredLink(),
								status: 400
							}
						};
					}
				} else {
					console.error(
						'User with id - ' +
							(decoded_token && typeof decoded_token !== 'string' && decoded_token.id
								? decoded_token.id
								: '' + ' - not found')
					);
					// return res.status(400).redirect(frontEndConnections.getBadRequestLink());
					return {
						success: false,
						data: null,
						msg: '',
						redirect: {
							url: frontEndConnections.getBadRequestLink(),
							status: 400
						}
					};
				}
			} else if (oldPassword) {
				let decoded_token = token;

				decoded_token = decoded_token ? decoded_token.split(' ')[1] : '';

				jwt.verify(decoded_token, this.authConfig.JWTSecret, async (err, decoded_token) => {
					if (err) {
						console.error(err);
						// commonUtils.sendResponse(res, 200, false, null, err as unknown as string);
						return {
							success: false,
							data: null,
							msg: err as unknown as string
						};
					}

					let userId = decoded_token && typeof decoded_token !== 'string' && decoded_token.id ? decoded_token.id : null;

					let user = await this.UserModel.findByCondition({
						id: userId
					});

					if (user && user.success && user.data) {
						if (Array.isArray(user.data)) {
							user.data = user.data[0];
						}
						let userLocalVar = user.data;
						isPasswordMatching(oldPassword, userLocalVar.password)
							.then(
								async (resolvedResult) => {
									if (resolvedResult) {
										let encryptedPassword = await encryptUserPassword(password);
										// let newUser = new User(user);
										userLocalVar.password = encryptedPassword;
										userLocalVar.isPasswordReset = false;
										// await user.save();
										await this.UserModel.update(userLocalVar.id, userLocalVar);
										// return commonUtils.sendResponse(res, 200, true, null, '');
										return {
											success: true,
											data: null,
											msg: ''
										};
									} else {
										console.error('ERROR: Password did not match');
										return {
											success: false,
											data: null,
											msg: 'Password did not match.'
										};
										// return commonUtils.sendResponse(res, 200, false, null, 'Password did not match.');
									}
								},
								(rejectedResult) => {
									console.error('ERROR: ', rejectedResult);
									// return commonUtils.sendResponse(
									// 	res,
									// 	200,
									// 	rejectedResult.success,
									// 	rejectedResult.data,
									// 	rejectedResult.msg
									// );
									return {
										success: rejectedResult.success,
										data: rejectedResult.data,
										msg: rejectedResult.msg
									};
								}
							)
							.catch((err) => {
								console.error('ERROR: ', err);
								// return commonUtils.sendResponse(res, 200, false, null, err as string);
								return {
									success: false,
									data: null,
									msg: err as string
								};
							});
					} else {
						// return commonUtils.sendResponse(res, 200, false, null, 'No such user found.');
						return {
							success: false,
							data: null,
							msg: 'No such user found.'
						};
					}
				});
				return {
					success: false,
					data: null,
					msg: ''
				};
			} else {
				console.error('Either Token or Oldpassword is required in the resetPassword url');
				// return res.status(400).redirect(frontEndConnections.getBadRequestLink());
				return {
					success: false,
					data: null,
					msg: '',
					redirect: {
						url: frontEndConnections.getBadRequestLink(),
						status: 400
					}
				};
			}
		} catch (error) {
			console.error(error);
			// return commonUtils.sendResponse(res, 200, false, null, error as string);
			return {
				success: false,
				data: null,
				msg: error as string
			};
		}
	};

	private sendMailEventUtil = async (user: IUserElement, emailEventName: AUTH_MAIL_EVENTS_E) => {
		if (!user) {
			console.error('HANDLED ERROR: no user info found.');
			return;
		}

		// const emailTemplate = getEmailTemplate(emailTemplateName)

		let templateValues: ITemplateValue;

		switch (emailEventName) {
			case AUTH_MAIL_EVENTS_E.EMAIL_CONFIRMATION_EVENT:
				{
					let token = jwt.sign({ id: String(user.id) }, this.authConfig.JWTSecret, {
						expiresIn: this.authConfig.JWT_VERIFICATION_EXPIRES_IN
					});

					templateValues = {
						userName: user.fullName,
						serverUrl: this.authConfig.SERVER_URL,
						verificationCode: token,
						toEmail: user.email
					};
				}
				break;

			case AUTH_MAIL_EVENTS_E.EMAIL_VERIFIED_EVENT:
				{
					templateValues = {
						userName: user.fullName,
						frontEndUrl: this.authConfig.FRONT_END_URL,
						toEmail: user.email
					};
				}
				break;

			case AUTH_MAIL_EVENTS_E.FORGOT_PASSWORD_EVENT:
				{
					let token = jwt.sign(
						{
							id: String(user.id),
							resetPasswordToken: user.resetPasswordToken
						},
						this.authConfig.JWTSecret,
						{ expiresIn: this.authConfig.JWT_PASSWORD_RESET_EXPIRES_IN }
					);

					templateValues = {
						userName: user.fullName,
						serverUrl: this.authConfig.SERVER_URL,
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

		this.mailEventEmitter(emailEventName, templateValues);
	};

	constructor(authInitProps: IinitAuthProps) {
		this.authConfig = authInitProps.authConfig;
		this.UserModel = authInitProps.UserModel;
		this.mailEventEmitter = authInitProps.mailEventEmitter;
		this.smsEventEmitter = authInitProps.smsEventEmitter;
	}

	public getMobileOTP = this.getMobileOTPUtil;
	public register = this.registerUtil;
	public validateMobile = this.validateMobileUtil;
	public login = this.loginUtil;
	public changeEmail = this.changeEmailUtil;
	public confirmEmailAddress = this.confirmEmailAddressUtil;
	public forgotPassword = this.forgotPasswordUtil;
	public resetPassword = this.resetPasswordUtil;
	public changePassword = this.changePasswordUtil;
	public sendMailEvent = this.sendMailEventUtil;
}
