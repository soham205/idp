import { Express } from 'express';
import session from 'express-session';

import { EXPRESS_SESSION_PROPS } from '../../config';

export const applySession = (app: Express) => {
	// const sessionStore = new MongoStore({
	//   mongoUrl: dbString,
	//   mongoOptions: dboptions,
	//   collectionName: "sessions",
	// });
	/**
	 *  To use db for saving session details un comment the above code.
	 */

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
};
