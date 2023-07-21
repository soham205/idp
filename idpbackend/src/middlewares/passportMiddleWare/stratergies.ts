import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';
import { JWT_PROPS } from '../../config';
import UserServices from '../../extensions/users/services/users.services';

export const getPassportJwtStratergy = () => {
	const passportJwtVerify: StrategyOptions = {
		jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
		secretOrKey: JWT_PROPS.JWT_SECRET
	};

	return new Strategy(passportJwtVerify, (jwtPayload, jwtVerifyCB) => {
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
			.catch((findUserError) => {
				console.error(
					'passportMidlleware :: stratergies :: getPassportJwtStratergy :: findUserError :: ',
					findUserError
				);
				jwtVerifyCB(false);
			});
	});
};
