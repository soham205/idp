import session from 'express-session';
import { Express } from 'express';
import passport from 'passport';
import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';

import compression from 'compression';
import { EXPRESS_SESSION_PROPS, JWT_SECRET } from '../../config';

import UserServices from '../../extensions/users/services/users.services';

function applySession(app: Express) {
	// const sessionStore = new MongoStore({
	//   mongoUrl: dbString,
	//   mongoOptions: dboptions,
	//   collectionName: "sessions",
	// });
	/**
	 *  To use db for saving session details un comment the above code.
	 */
	app.use(compression());

	app.use(
		session({
			secret: EXPRESS_SESSION_PROPS.EXPRESS_SESSION_SECRET,
			resave: EXPRESS_SESSION_PROPS.RESAVE,
			saveUninitialized: EXPRESS_SESSION_PROPS.SAVE_UNINITIALIZED,
			store: undefined, // use db specific store here
			proxy: EXPRESS_SESSION_PROPS.PROXY,
			cookie: {
				maxAge: EXPRESS_SESSION_PROPS.COOKIE_PROPS.MAX_AGE,
				secure: true,
				sameSite: EXPRESS_SESSION_PROPS.COOKIE_PROPS.SAME_SITE as boolean | 'lax' | 'strict' | 'none' | undefined,
				httpOnly: false,
				domain: EXPRESS_SESSION_PROPS.COOKIE_PROPS.DOMAIN
			}
		})
	);
}

function applyPassportAuthentication(app: Express) {
	app.use(passport.initialize());
	app.use(passport.session());

	const passportJwtVerify: StrategyOptions = {
		jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
		secretOrKey: JWT_SECRET
	};

	passport.use(
		new Strategy(passportJwtVerify, (jwtPayload, jwtVerifyCB) => {
			UserServices.findByCondition({ id: jwtPayload.id })
				.then((result) => {
					if (result) {
						if (result.success && result.data) {
							return jwtVerifyCB(true, result.data);
						}
					} else {
						return jwtVerifyCB(false);
					}
				})
				.catch((error) => {
					console.error(error);
				});
		})
	);

	app.use(passport.authenticate('jwt', { session: false }));
}

const passportMiddleWare = {
	usePassportMiddleware: (app: Express) => {
		applySession(app);
		applyPassportAuthentication(app);
	}
};

export default passportMiddleWare;
