import Validator from "validator";

import { isEmpty } from "./_isEmpty";
import { errorUtils } from "../errorUtils";

export const validateName = (name: string) => {

  if (isEmpty(name)) {

    return errorUtils.createErrorElement('fullname', 'Name field is required');

  } else if (!Validator.isLength(name, { min: 2, max: 30 })) {

    return errorUtils.createErrorElement('fullname', 'Name must be between 2 and 30 characters');

  }

}
