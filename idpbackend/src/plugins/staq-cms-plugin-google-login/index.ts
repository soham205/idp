import { Router, Request, Response } from 'express';
import passport, { Profile } from 'passport';
import { Strategy } from 'passport-google-oauth20';
import jwt from 'jsonwebtoken';
import {
	GOOGLE_LOGIN_FAILED_REDIRECT,
	GOOGLE_LOGIN_SUCCESS_REDIRECT,
	GOOGLE_LOGIN_PAGE_REDIRECT_API,
	GOOGLE_LOGIN_RESULT_REDIRECT_API
} from './constants';
import { commonUtils } from './commonUtils';

export type CREATE_OR_FIND_USER_T = (googleProfileDetails: Profile) => Promise<unknown>;

interface IInitGoogleLoginProps {
	clientID: string;
	clientSecret: string;
	jwtSecret: string;
	jwtLoginExpiresIn: string;
	createOrFindUser: CREATE_OR_FIND_USER_T;
}

export class GoogleLogin {
	private clientID = '';
	private clientSecret = '';
	private jwtSecret = '';
	private jwtLoginExpiresIn = '';
	private createOrFindUser: CREATE_OR_FIND_USER_T | undefined;

	constructor(initGoogleLoginProps: IInitGoogleLoginProps) {
		this.clientID = initGoogleLoginProps.clientID;
		this.clientSecret = initGoogleLoginProps.clientSecret;
		this.jwtSecret = initGoogleLoginProps.jwtSecret;
		this.jwtLoginExpiresIn = initGoogleLoginProps.jwtLoginExpiresIn;
		this.createOrFindUser = initGoogleLoginProps.createOrFindUser;
		
	}

	private getRouter() {
		try {
			const router = Router();

			passport.use(
				new Strategy(
					{
						clientID: this.clientID,
						clientSecret: this.clientSecret,
						callbackURL: GOOGLE_LOGIN_RESULT_REDIRECT_API,
						passReqToCallback: true
					},
					async (req: Express.Request, accessToken: string, refreshToken: string, profile: Profile, done) => {
						try {
							if (this?.createOrFindUser) {
								const user = await this.createOrFindUser(profile);
								req.user = user ? user : undefined;
								done(null, user ? user : profile);
							} else {
								done(new Error('User could not be created.'), profile);
							}
						} catch (error) {
							done(new Error(error as string), {});
						}
					}
				)
			);

			// Serialize and Deserialize user for session management
			passport.serializeUser((user, done) => done(null, user));
			passport.deserializeUser((obj: Express.User | false | null, done) => done(null, obj));

			router.get(GOOGLE_LOGIN_PAGE_REDIRECT_API, passport.authenticate('google', { scope: ['profile', 'email'] }));

			router.get(
				GOOGLE_LOGIN_RESULT_REDIRECT_API,
				passport?.authenticate('google', {
					failureRedirect: GOOGLE_LOGIN_FAILED_REDIRECT
				}),
				(req: Request, res: Response) => {
					try {
						const user = req.user;
						if (!user) {
							return commonUtils.sendResponse(res, 401, false, null, 'Login failed with google.');
						}

						let userToken = jwt.sign(
							{
								...req.user
							},
							this.jwtSecret,
							{
								expiresIn: this.jwtLoginExpiresIn
							}
						);

						return commonUtils.sendResponse(res, 200, true, userToken, '');
					} catch (googleLoginError) {
						console.error('googleLogin :: googleLoginError :: ', googleLoginError);
						return commonUtils.sendResponse(res, 401, false, null, googleLoginError as string);
					}
				}
			);

			router.get(GOOGLE_LOGIN_FAILED_REDIRECT, (req: Request, res: Response) => {
				commonUtils.sendResponse(res, 401, true, null, 'Google login failed.');
			});

			return router;
		} catch (googelLoginError) {
			console.error('addGoogleLoginRoute :: getRouter :: googelLoginError :: ', googelLoginError);
			throw new Error(googelLoginError as string);
		}
	}

	public getGoogleLoginRoute() {
		return this.getRouter();
	}
}
