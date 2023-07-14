import bcrypt from 'bcryptjs';
import axios from 'axios';

import { Environment } from '../../config/env';


export const encryptUserPassword = (password: string): Promise<string> => {
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
};

export const isPasswordMatching = (password: string, passwordHash: string): Promise<boolean> => {
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
};


export const checkFacebookPermissions = async (accessToken: string) => {
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

export const verifyFacebookAccessToken = async (accessToken: string) => {
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
