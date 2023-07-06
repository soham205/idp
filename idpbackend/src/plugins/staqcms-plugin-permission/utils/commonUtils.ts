import { Response } from 'express';

export const commonUtils = {
	deleteUndefinedFieldsInObject: function (jsObj: any) {
		if (!jsObj) {
			return jsObj;
		}
		// Delete null or undefined fields.
		for (let key in jsObj) {
			if (jsObj.hasOwnProperty(key)) {
				if (!jsObj[key] && typeof jsObj[key] !== 'boolean') {
					delete jsObj[key];
				}
			}
		}

		return jsObj;
	},

	sendResponse: function (res: Response, status: number, success: boolean, data: unknown, msg: string): void {
		let responseData = { success, data, msg };

		status = Number(status);

		if (typeof status !== 'number') {
			console.error(
				`Argument - status - should be of type number. Received type - ${typeof status}. Using default status - 200.`
			);
			status = 200;
		}

		responseData = this.deleteUndefinedFieldsInObject(responseData);
		res.status(status).json(responseData);
	}
};
