import Validator from "validator";

import { isEmpty } from "./_isEmpty";
import { errorUtils } from "../errorUtils";



export const validatePasswords = (password1:string, password2:string) => {

  if (isEmpty(password1)) {

    return errorUtils.createErrorElement('password', 'Password field is required');

  } else if (isEmpty(password2)) {

    return errorUtils.createErrorElement('password2', 'Confirm Password field is required');

  } else if (!Validator.isLength(password1, { min: 8, max: 30 })) {

    return errorUtils.createErrorElement('password', 'Password must be at least 8 characters');

  } else {
    if (!Validator.equals(password1, password2)) {
      return errorUtils.createErrorElement('password2', 'Passwords must match');
    }

  }

}
