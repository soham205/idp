import { errorUtils } from '../errorUtils';
import { validateName } from './_nameValidation';
import { validateEmail } from './_emailValidation';
import { validatePasswords } from './_passwordsValidation';

interface IRegisterData {
	fullname: string;
	email: string;
	password: string;
	password2: string;
}

export const registrationValidations = (data: IRegisterData) => {
	let errors = [];
	let nameError = validateName(data.fullname);
	if (nameError) {
		errors.push(nameError);
	}

	let emailError = validateEmail(data.email);
	if (emailError) {
		errors.push(emailError);
	}

	let passwordsError = validatePasswords(data.password, data.password2);
	if (passwordsError) {
		errors.push(passwordsError);
	}

	return errorUtils.getErrorObject(errors);
};
