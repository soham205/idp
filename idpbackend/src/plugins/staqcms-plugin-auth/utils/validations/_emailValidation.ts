import Validator from "validator";

import { isEmpty } from "./_isEmpty";
import { errorUtils } from "../errorUtils";

export const validateEmail = (email:string) => {

    if (isEmpty(email)) {

        return errorUtils.createErrorElement('email', 'Email field is required');

    } else if (!Validator.isEmail(email)) {

        return errorUtils.createErrorElement('email', 'Email is invalid');

    }
}
