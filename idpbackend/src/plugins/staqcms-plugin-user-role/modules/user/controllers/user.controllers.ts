import { Request, Response } from 'express';
import { IInitUserServiceProps, IUserController } from '../../../interfaces/userinterface/index';

import { commonUtils } from '../../../utils/commonUtils';
let userServices: IInitUserServiceProps;
export const userController: IUserController = {
	init: (userServiceProps: IInitUserServiceProps) => {
		userServices = userServiceProps;
	},

	create: async (req: Request, res: Response) => {
		let success = false;
		let createResult = null;
		let message = '';
		try {
			createResult = await userServices.create(req.body);
			success = true;
		} catch (createUserError) {
			console.error('userController :: create :: createUserError :: ', createUserError);
			message = createUserError as string;
		}
		return commonUtils.sendResponse(res, 200, success, createResult?.data, message);
	},

	find: async (req: Request, res: Response) => {
		let success = false;
		let createResult = null;
		let message = '';
		try {
			createResult = await userServices.findAll(req.query);
			success = true;
		} catch (findUserError) {
			console.error('userController :: find :: findUserError :: ', findUserError);
			message = findUserError as string;
		}
		return commonUtils.sendResponse(res, 200, success, createResult?.data, message);
	},

	findOne: async (req: Request, res: Response) => {
		let success = false;
		let createResult = null;
		let message = '';
		try {
			createResult = await userServices.findOne(req.params.id);
			success = true;
		} catch (findOneUserError) {
			console.error('userController :: findone :: findOneUserError :: ', findOneUserError);
			message = findOneUserError as string;
		}
		return commonUtils.sendResponse(res, 200, success, createResult?.data, message);
	},

	update: async (req: Request, res: Response) => {
		let success = false;
		let createResult = null;
		let message = '';
		try {
			createResult = await userServices.update(req.params.id, req.body);
			success = true;
		} catch (updateUserError) {
			console.error('userController :: update :: updateUserError :: ', updateUserError);
			message = updateUserError as string;
		}
		return commonUtils.sendResponse(res, 200, success, createResult?.data, message);
	},

	delete: async (req: Request, res: Response) => {
		let success = false;
		let createResult = null;
		let message = '';
		try {
			createResult = await userServices.deleteOne(req.params.id);
			success = true;
		} catch (deleteUserError) {
			console.error('userController :: delete :: deleteUserError :: ', deleteUserError);
			message = deleteUserError as string;
		}
		return commonUtils.sendResponse(res, 200, success, createResult?.data, message);
	},

	deleteAll: async (req: Request, res: Response) => {
		let success = false;
		let createResult = null;
		let message = '';
		try {
			createResult = await userServices.deleteAll();
			success = true;
		} catch (deleteAllUserError) {
			console.error('userController :: deleteall :: deleteAllUserError :: ', deleteAllUserError);
			message = deleteAllUserError as string;
		}
		return commonUtils.sendResponse(res, 200, success, createResult?.data, message);
	}
};
