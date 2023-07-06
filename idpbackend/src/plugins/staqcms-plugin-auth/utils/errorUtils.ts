import { IError } from "./validations/errorInterfaces";

const MESSAGE_SEPERATOR = ' // '

interface IErrorUtil {
    stack: Error[],
    message: string
}

export const errorUtils = {
    createErrorElement: (type: string, message: string): IError => {
        return { type, message };
    },

    getErrorObject: (errors: IError[]) => {
        let errorObj: IErrorUtil = {
            message: '',
            stack: []
        };
        let errorLocalVar: Error[] = []
        if (!Array.isArray(errors)) {
            errorLocalVar = [errors]
        }
        if (errorLocalVar.length > 0) {
            // errorObj = {};
            errorObj.stack = errorLocalVar;
            let errorMsg = '';
            for (const error of errorLocalVar) {
                if (errorMsg.length > 0) {
                    errorMsg += MESSAGE_SEPERATOR;
                }
                errorMsg += error.message;
            }
            errorObj.message = errorMsg;
        }
        return errorObj;
    }

}