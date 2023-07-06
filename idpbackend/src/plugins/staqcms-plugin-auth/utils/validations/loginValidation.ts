import { isEmpty } from "./_isEmpty"
import { errorUtils } from "../errorUtils"
import { validateEmail } from "./_emailValidation"



interface ILoginValidationData {
  token?: string
  email: string
  password: string
}

export const loginValidation = (data: ILoginValidationData) => {
  let errors = [];

  if (data.token) {
    //no validation is required as token login has no other info
    return;
  }

  let emailError = validateEmail(data.email);

  if (emailError) {
    errors.push(emailError);
  }

  if (isEmpty(data.password)) {
    errors.push(errorUtils.createErrorElement('password', 'password field is required.'))
  }
  return errorUtils.getErrorObject(errors);
}
