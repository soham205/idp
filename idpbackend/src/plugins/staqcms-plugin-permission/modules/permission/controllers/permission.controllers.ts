import { Request, Response } from 'express';
import {
	IInitPermissionServiceProps,
	IPermissionController,
	IUpdatePermissionData,
	FIND_ALL_FILTER_OPTONS_T
} from '../../../interfaces/index';
import { commonUtils } from '../../../utils/commonUtils';

let permissionServices: IInitPermissionServiceProps;

export const permissionController: IPermissionController = {
	init: (permissionServiceProps: IInitPermissionServiceProps) => {
		permissionServices = permissionServiceProps;
	},
	create: async (req: Request, res: Response) => {
		let success = false;
		let createResult = null;
		let message = '';
		try {
			createResult = await permissionServices.create(req.body);
			success = true;
		} catch (createPermissionError) {
			console.error('permissionController :: create :: createPermissionError :: ', createPermissionError);
			message = createPermissionError as string;
		}

		return commonUtils.sendResponse(res, 200, success, createResult, message);
	},

	find: async (req: Request, res: Response): Promise<void> => {
		let success = false;
		let createResult = null;
		let message = '';
		try {
			createResult = await permissionServices.findAll(req.query as FIND_ALL_FILTER_OPTONS_T);
			success = true;
		} catch (findPermissionError) {
			console.error('permissionController :: create :: findPermissionError :: ', findPermissionError);
			message = findPermissionError as string;
		}

		return commonUtils.sendResponse(res, 200, success, createResult, message);
	},

	findOne: async (req: Request, res: Response) => {
		let success = false;
		let createResult = null;
		let message = '';
		try {
			createResult = await permissionServices.findOne(req.params.id);
			success = true;
		} catch (findOnePermissionError) {
			console.error('permissionController :: findone :: findOneUserError :: ', findOnePermissionError);
			message = findOnePermissionError as string;
		}
		return commonUtils.sendResponse(res, 200, success, createResult, message);
	},

	update: async (req: Request, res: Response) => {
		let success = false;
		let createResult = null;
		let message = '';
		try {
			createResult = await permissionServices.update(req.params.id, req.body);
			success = true;
		} catch (updatePermissionError) {
			console.error('userController :: update :: updatePermissionError :: ', updatePermissionError);
			message = updatePermissionError as string;
		}
		return commonUtils.sendResponse(res, 200, success, createResult, message);
	},

	updatePermissions: async (req: Request, res: Response) => {
		const request = req.body;
		let updatePermissions = [];
		for (let [module, permissionsArr] of Object.entries(request)) {
			let permissionsArrLocalVar = <IUpdatePermissionData[]>permissionsArr;
			updatePermissions.push(...permissionsArrLocalVar);
		}
		let isSuccess = true;
		let errorMsg = '';
		for (let updatePermission of updatePermissions) {
			let updateResult = await permissionServices.update(updatePermission.id, {
				...updatePermission
			});
			isSuccess = isSuccess && updateResult.success;
			if (updateResult.message) {
				errorMsg += updateResult.message;
			}
		}
		return commonUtils.sendResponse(res, 200, isSuccess, null, errorMsg);
	},

	delete: async (req: Request, res: Response) => {
		let success = false;
		let createResult = null;
		let message = '';
		try {
			createResult = await permissionServices.deleteOne(req.params.id);
			success = true;
		} catch (deletePermissionError) {
			console.error('userController :: delete :: deletePermissionError :: ', deletePermissionError);
			message = deletePermissionError as string;
		}
		return commonUtils.sendResponse(res, 200, success, createResult, message);
	},

	deleteAll: async (req: Request, res: Response) => {
		let success = false;
		let createResult = null;
		let message = '';
		try {
			createResult = await permissionServices.deleteAll();
			success = true;
		} catch (deleteAllPermissionError) {
			console.error('userController :: deleteall :: deleteAllPermissionError :: ', deleteAllPermissionError);
			message = deleteAllPermissionError as string;
		}
		return commonUtils.sendResponse(res, 200, success, createResult, message);
	}
};
