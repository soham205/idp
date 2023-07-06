import moment from 'moment';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

import { Request, Response } from 'express';
import { authService } from './auth.services';
import { commonUtils } from '../../../utils/commonUtils';
import { AUTH_EVENT_NAME_E, PROVIDERS_E } from '../../../config/env';
import { frontEndConnections } from '../../../utils/frontEndConnection';
import { validateEmail } from '../../../utils/validations/_emailValidation';
import { loginValidation } from '../../../utils/validations/loginValidation';
import {
	IAuthConfig,
	IRoleElement,
	IUserElement,
	IinitAuthProps,
	IUserBaseServices,
	IModuleServiceResult
} from '../../../interfaces';
import { validatePasswords } from '../../../utils/validations/_passwordsValidation';
import { IError } from '../../../utils/validations/errorInterfaces';

let config: IAuthConfig;
let User: IUserBaseServices;

const MOBILE_OTP_VALIDITY_MINUTES = 15;

export const authController = {
	init: ({ defaultRoleId, UserModel, authConfig, mailEventEmitter, smsEventEmitter }: IinitAuthProps) => {
		User = UserModel;
		config = authConfig;
		authService.initBaseService({ authConfig, defaultRoleId, mailEventEmitter, smsEventEmitter, UserModel });
	},

	changeEmail: async (req: Request, res: Response) => {
		try {
			let changeInEmail = await authService.changeEmail(req.body);

			return commonUtils.sendResponse(res, 200, changeInEmail.success, changeInEmail.data, changeInEmail.msg);
		} catch (error) {
			console.error(error);
			return commonUtils.sendResponse(res, 200, false, null, error as string);
		}
	},

	getMobileOTP: async (req: Request, res: Response) => {
		try {
			let registerResult = await authService.getMobileOTP(req.body);

			commonUtils.sendResponse(res, 200, registerResult.success, registerResult.data, registerResult.msg);
		} catch (error) {
			console.error(error);
			return commonUtils.sendResponse(res, 200, false, null, error as string);
		}
	},

	register: async (req: Request, res: Response) => {
		try {
			let registerResult = await authService.register(req.body);

			commonUtils.sendResponse(res, 200, registerResult.success, registerResult.data, registerResult.msg);
		} catch (error) {
			console.error(error);
			return commonUtils.sendResponse(res, 200, false, null, error as string);
		}
	},

	login: async (req: any, res: Response) => {
		try {
			//TODO: Document token requirement
			const { password, email, reqSource, token } = req.body;

			const loginError = loginValidation(req.body);

			if (loginError?.message) {
				console.error('ERROR: ', loginError);
				return commonUtils.sendResponse(res, 200, false, null, loginError.message);
			}

			let user: undefined | IUserElement | IModuleServiceResult;
			let sessionId;

			if (token) {
				try {
					let decoded_token = await commonUtils.jwtVerify(String(token), config.JWTSecret);
					if (
						typeof decoded_token !== 'string' &&
						decoded_token &&
						decoded_token.exp &&
						decoded_token.exp > new Date().getTime() / 1000
					) {
						// Getting user details along with roles. To be implemented in all.
						let userFindOneResult = await User.findByCondition({ _id: decoded_token.id });
						if (userFindOneResult && userFindOneResult.success && userFindOneResult.data) {
							if (Array.isArray(userFindOneResult.data)) {
								userFindOneResult.data = userFindOneResult.data[0];
							}
							user = userFindOneResult.data;
						}

						sessionId = decoded_token.sessionId;
					} else {
						return commonUtils.sendResponse(res, 200, false, null, 'Token expired! Login again to access.');
					}
				} catch (error) {
					console.error(error);
					return res.status(400).redirect(frontEndConnections.getBadRequestLink());
				}
			} else {
				user = await User.findByCondition({ email });
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
				return commonUtils.sendResponse(res, 200, false, null, 'Invalid email address or password.');
			}
			let userLocalVar = <IUserElement>user;

			if (userLocalVar) {
				let isUserAuthorized;
				if (token) {
					isUserAuthorized = true;
				} else {
					try {						
						let matchResult = await authService.isPasswordMatching(password, userLocalVar.password);
						isUserAuthorized = matchResult;
					} catch (error) {
					}
				}

				// const userRoles = _.map(user.roles, (role: IRoleElement) => role.name)
				let userRoleArray = <IRoleElement[]>(userLocalVar.roles);


				const userRoles = userRoleArray.map((role: IRoleElement) => role.name);
				console.log('isUserAuthorized', isUserAuthorized);

				if (isUserAuthorized) {
					if (!token && reqSource === 'sso') {
						sessionId = req.session.id;
					}

					let userToken = jwt.sign(
						{
							id: userLocalVar.id,
							fullname: userLocalVar.fullname,
							roles: userRoles,
							reqSource,
							sessionId
						},
						config.JWTSecret,
						{
							expiresIn: config.JWT_LOGIN_EXPIRES_IN
						}
					);

					if (reqSource === 'sso' && req.session && req.session.user) {
						let decoded_session_token = await commonUtils.jwtVerify(String(req.session.user), config.JWTSecret);

						if (
							decoded_session_token &&
							typeof decoded_session_token !== 'string' &&
							String(decoded_session_token.id) !== String(userLocalVar.id)
						) {
							return commonUtils.sendResponse(res, 200, true, { action: 'login_again' }, '');
						}

						userToken = req.session.user;
					}

					userLocalVar.provider = PROVIDERS_E.LOCAL;

					if (reqSource === 'sso' && !req.session.user) {
						req.session.user = userToken;
					}
					await User.update(userLocalVar.id, userLocalVar)
					return commonUtils.sendResponse(res, 200, true, userToken, '')
					//TODO : rewrite save
					// user.save(() => {
					// })
				} else {
					console.log('-----');
					
					return commonUtils.sendResponse(res, 200, false, null, 'Incorrect email or password.');
				}
			} else {
				console.error(
					'Your Email Address is not verified yet. Please open the link sent on your email to verify first.'
				);

				return commonUtils.sendResponse(
					res,
					200,
					false,
					null,
					'Your Email Address is not verified yet. Please open the link sent on your email to verify first.'
				);
			}
		} catch (error) {
			console.error(error);
			return commonUtils.sendResponse(res, 200, false, null, error as string);
		}
	},

	facebookLogin: async (req: Request, res: Response) => {
		try {
			let userFacebookLogin = await authService.facebookLogin(req);
			return commonUtils.sendResponse(
				res,
				200,
				userFacebookLogin.success,
				userFacebookLogin.data,
				userFacebookLogin.msg
			);
		} catch (error) {
			console.error(error);
			return commonUtils.sendResponse(res, 200, false, null, error as string);
		}
	},

	validateMobile: async (req: Request, res: Response) => {
		try {
			const { _id, phoneOTP } = req.body;

			if (phoneOTP) {
				let user: IModuleServiceResult | IUserElement = await User.findByCondition({
					_id
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

							User.update(user.id, user).then((userResult: unknown) => {
								return commonUtils.sendResponse(res, 200, true, userResult, '');
							});
						} else {
							return commonUtils.sendResponse(res, 200, false, null, 'OTP does not match.');
						}
					} else {
						return commonUtils.sendResponse(res, 200, false, null, 'OTP expired. Please try again');
					}
				} else {
					return commonUtils.sendResponse(res, 200, false, null, 'User with id - ' + _id + ' - not found');
				}
			} else {
				return commonUtils.sendResponse(res, 200, false, null, 'OTP is required to proceed');
			}
		} catch (error) {
			console.error(error);
			return commonUtils.sendResponse(res, 200, false, null, error as string);
		}
	},

	confirmEmailAddress: (req: Request, res: Response) => {
		try {
			let token = req.query.token;

			if (typeof token === 'string' && token) {
				jwt.verify(token, config.JWTSecret, async function (error, decoded_token: string | jwt.JwtPayload | undefined) {
					let decodedTokenLocalVar: jwt.JwtPayload | undefined;
					if (error) {
						console.error('ERROR: ', error);

						if (error.name !== 'TokenExpiredError') {
							return res.status(400).redirect(frontEndConnections.getBadRequestLink());
						}
						if (!decoded_token && typeof token === 'string') {
							let decodedResult = jwt.decode(token);
							if (decodedResult && typeof decodedResult !== 'string') {
								decodedTokenLocalVar = decodedResult;
							}
						}
					}

					let user = await User.findByCondition({
						_id: decodedTokenLocalVar && decodedTokenLocalVar.id ? decodedTokenLocalVar.id : null
					});

					if (user && user.success && user.data) {
						if (Array.isArray(user.data)) {
							user.data = user.data[0];
						}
						let userLocalVar = user.data;
						if (
							decoded_token &&
							typeof decoded_token !== 'string' &&
							decoded_token.exp &&
							decoded_token.exp > new Date().getTime() / 1000
						) {
							if (decoded_token.email && decoded_token.email !== userLocalVar.newEmail) {
								return res.status(400).redirect(frontEndConnections.getBadRequestLink());
							}
							userLocalVar.isConfirmed = true;

							if (userLocalVar.newEmail && decoded_token.email && userLocalVar.newEmail === decoded_token.email) {
								userLocalVar.email = userLocalVar.newEmail;
							}

							try {
								await User.update(userLocalVar.id, userLocalVar);
								res.redirect(frontEndConnections.getEmailVerificationSuccessLink(userLocalVar.fullname));
								authService.sendMailEvent(userLocalVar, AUTH_EVENT_NAME_E.EMAIL_VERIFIED_EVENT);
							} catch (error) {
								console.error(error);
								return commonUtils.sendResponse(
									res,
									200,
									false,
									null,
									'Something went wrong. Please try after sometime.'
								);
							}
						} else {
							return res.redirect(frontEndConnections.getEmailVerificationLinkExpiredLink(userLocalVar.fullname));
						}
					} else {
						console.error('User with id - ' + JSON.stringify(decoded_token) + ' - not found');
						return res.status(400).redirect(frontEndConnections.getBadRequestLink());
					}
				});
			} else {
				console.error('Token is missing in the url');
				return res.status(400).redirect(frontEndConnections.getBadRequestLink());
			}
		} catch (error) {
			console.error(error);
			return commonUtils.sendResponse(res, 200, false, null, error as string);
		}
	},

	forgotPassword: async (req: Request, res: Response) => {
		try {
			let { email } = req.body;

			const emailError = validateEmail(email);

			if (emailError) {
				console.error('ERROR: ', emailError);

				return commonUtils.sendResponse(res, 200, false, null, emailError.message);
			}

			email = email.toLowerCase();

			let user = await User.findByCondition({
				email: email
			});

			if (!(user && user.success && user.data)) {
				return commonUtils.sendResponse(res, 200, false, null, 'This email does not exist.');
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
			await User.update(userLocalVar.id, userLocalVar);

			authService.sendMailEvent(userLocalVar, AUTH_EVENT_NAME_E.FORGOT_PASSWORD_EVENT);

			return commonUtils.sendResponse(res, 200, true, null, '');
		} catch (error) {
			console.error(error);
			return commonUtils.sendResponse(res, 200, false, null, error as string);
		}
	},

	resetPassword: (req: Request, res: Response) => {
		try {
			let token = req.query.token;

			if (token && typeof token === 'string') {
				jwt.verify(token, config.JWTSecret, async function (error, decoded_token) {
					let decodedTokenLocalVar: jwt.JwtPayload | undefined;
					if (error) {
						console.error(error);

						if (error.name !== 'TokenExpiredError') {
							return res.status(400).redirect(frontEndConnections.getBadRequestLink());
						}
					}
					if (!decoded_token && typeof token === 'string') {
						let decodeTokenResult = jwt.decode(token);
						if (decodeTokenResult && typeof decodeTokenResult !== 'string') {
							decodedTokenLocalVar = decodeTokenResult;
						}
					}

					let user = await User.findByCondition({
						_id: decodedTokenLocalVar && decodedTokenLocalVar.id ? decodedTokenLocalVar.id : null
					});

					if (user && user.success && user.data) {
						if (
							decoded_token &&
							typeof decoded_token !== 'string' &&
							decoded_token.exp &&
							decoded_token.exp > new Date().getTime() / 1000
						) {
							res.redirect(frontEndConnections.getResetPasswordLink(token as string, []));
						} else {
							return res.redirect(frontEndConnections.getResetPasswordLinkExpiredLink());
						}
					} else {
						console.error('User with id - ' + decodedTokenLocalVar + ' - not found');
						return res.status(400).redirect(frontEndConnections.getBadRequestLink());
					}
				});
			} else {
				console.error('Token is missing in the resetPassword url');
				return res.status(400).redirect(frontEndConnections.getBadRequestLink());
			}
		} catch (error) {
			console.error(error);
			return commonUtils.sendResponse(res, 200, false, null, error as string);
		}
	},

	changePassword: async (req: Request, res: Response) => {
		try {
			let { oldPassword, resetPasswordToken, password, password2 } = req.body;

			if (resetPasswordToken && typeof resetPasswordToken === 'string') {
				jwt.verify(resetPasswordToken, config.JWTSecret, async function (error, decoded_token) {
					if (error) {
						console.error(error);

						if (error.name !== 'TokenExpiredError') {
							return res.status(400).redirect(frontEndConnections.getBadRequestLink());
						}
					}
					let localDecodedTokenVar: jwt.JwtPayload | undefined;
					if (!decoded_token) {
						let decodedTokenResult = jwt.decode(resetPasswordToken);
						if (decodedTokenResult && typeof decodedTokenResult !== 'string') {
							localDecodedTokenVar = decodedTokenResult;
						}
					}

					let user = await User.findByCondition({
						_id: localDecodedTokenVar && localDecodedTokenVar.id ? localDecodedTokenVar.id : null
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
									res.redirect(frontEndConnections.getResetPasswordLink(resetPasswordToken, passwordsError));
								} else {
									let encryptedPassword = await authService.encryptUserPassword(password);

									// let newUser = new User(user);

									userLocalvar.password = encryptedPassword;
									userLocalvar.provider = PROVIDERS_E.LOCAL;
									userLocalvar.isPasswordReset = false;
									userLocalvar.resetPasswordToken = null;

									// await newUser.save();

									res.redirect(frontEndConnections.getResetPasswordSuccessLink(userLocalvar.fullname));
								}
							} else {
								let errors: string | [{ type: string; msg: string }] = [
									{ type: 'resetPasswordToken', msg: 'No request to reset password found.' }
								];

								errors = JSON.stringify(errors);
								errors = encodeURIComponent(errors);
								res.redirect(frontEndConnections.getResetPasswordLink(resetPasswordToken, errors));
							}
						} else {
							return res.redirect(frontEndConnections.getResetPasswordLinkExpiredLink());
						}
					} else {
						console.error(
							'User with id - ' +
							(decoded_token && typeof decoded_token !== 'string' && decoded_token.id
								? decoded_token.id
								: '' + ' - not found')
						);
						return res.status(400).redirect(frontEndConnections.getBadRequestLink());
					}
				});
			} else if (oldPassword) {
				let decoded_token = req.headers.authorization;

				decoded_token = decoded_token ? decoded_token.split(' ')[1] : '';

				jwt.verify(decoded_token, config.JWTSecret, async (err, decoded_token) => {
					if (err) {
						console.error(err);
						commonUtils.sendResponse(res, 200, false, null, err as unknown as string);
					}

					let userId = decoded_token && typeof decoded_token !== 'string' && decoded_token.id ? decoded_token.id : null;

					let user = await User.findByCondition({
						_id: userId
					});

					if (user && user.success && user.data) {
						if (Array.isArray(user.data)) {
							user.data = user.data[0];
						}
						let userLocalVar = user.data;
						authService
							.isPasswordMatching(oldPassword, userLocalVar.password)
							.then(
								async (resolvedResult) => {
									if (resolvedResult) {
										let encryptedPassword = await authService.encryptUserPassword(password);
										// let newUser = new User(user);
										userLocalVar.password = encryptedPassword;
										userLocalVar.isPasswordReset = false;
										// await user.save();
										await User.update(userLocalVar.id, userLocalVar);
										return commonUtils.sendResponse(res, 200, true, null, '');
									} else {
										console.error('ERROR: Password did not match');
										return commonUtils.sendResponse(res, 200, false, null, 'Password did not match.');
									}
								},
								(rejectedResult) => {
									console.error('ERROR: ', rejectedResult);
									return commonUtils.sendResponse(
										res,
										200,
										rejectedResult.success,
										rejectedResult.data,
										rejectedResult.msg
									);
								}
							)
							.catch((err) => {
								console.error('ERROR: ', err);
								return commonUtils.sendResponse(res, 200, false, null, err as string);
							});
					} else {
						return commonUtils.sendResponse(res, 200, false, null, 'No such user found.');
					}
				});
			} else {
				console.error('Either Token or Oldpassword is required in the resetPassword url');
				return res.status(400).redirect(frontEndConnections.getBadRequestLink());
			}
		} catch (error) {
			console.error(error);
			return commonUtils.sendResponse(res, 200, false, null, error as string);
		}
	}
};
