import passport from 'passport';
import { Express } from 'express';
import { getPassportJwtStratergy } from './stratergies';

function initializePassport(app: Express) {
	app.use(passport.initialize());

	app.use(passport.session());
}

function addPassportStratergies() {
	passport.use(getPassportJwtStratergy());
}

const passportMiddleWare = {
	initializePassportMiddleware: (app: Express) => {
		initializePassport(app);
		addPassportStratergies();
	}
};

export default passportMiddleWare;
