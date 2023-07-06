import { Request, Response } from 'express';
import { IRolesController, IRoleBaseService, FIND_ALL_FILTER_OPTONS_T } from '../../../interfaces/roleInterfaces';

import { commonUtils } from '../../../utils/commonUtils';

let roleServices: IRoleBaseService;

export const rolesController: IRolesController = {
	init: (roleServiceProps) => {
		roleServices = roleServiceProps;
	},

	create: async (req: Request, res: Response) => {
		let success = false;
		let createResult = null;
		let message = '';
		try {
			createResult = await roleServices.create(req.body);
			success = true;
		} catch (createRoleError) {
			console.error('rolesController :: create :: createRoleError :: ', createRoleError);
			message = createRoleError as string;
		}

		return commonUtils.sendResponse(res, 200, success, createResult?.data, message);
	},

	find: async (req: Request, res: Response) => {
		let success = false;
		let findResult = null;
		let message = '';
		try {
			
			findResult = await roleServices.findAll(req.query as FIND_ALL_FILTER_OPTONS_T);
			success = true;
		} catch (findRoleError) {
			console.error('rolesController :: find :: findRoleError :: ', findRoleError);
			message = findRoleError as string;
		}

		return commonUtils.sendResponse(res, 200, success, findResult?.data, message);
	},

	findOne: async (req: Request, res: Response) => {
		let success = false;
		let createResult = null;
		let message = '';
		try {
			createResult = await roleServices.findOne(req.params.id);
			success = true;
		} catch (findOneRoleError) {
			console.error('rolesController :: findOne :: findOneRoleError :: ', findOneRoleError);
			message = findOneRoleError as string;
		}

		return commonUtils.sendResponse(res, 200, success, createResult?.data, message);
	},

	update: async (req: Request, res: Response) => {
		let success = false;
		let createResult = null;
		let message = '';
		try {
			createResult = await roleServices.update(req.params.id, req.body);
			success = true;
		} catch (updateRoleError) {
			console.error('rolesController :: update :: updateRoleError :: ', updateRoleError);
			message = updateRoleError as string;
		}

		return commonUtils.sendResponse(res, 200, success, createResult?.data, message);
	},

	delete: async (req: Request, res: Response) => {
		let success = false;
		let createResult = null;
		let message = '';
		try {
			createResult = await roleServices.deleteOne(req.params.id);
			success = true;
		} catch (deleteRoleError) {
			console.error('rolesController :: delete :: deleteRoleError :: ', deleteRoleError);
			message = deleteRoleError as string;
		}

		return commonUtils.sendResponse(res, 200, success, createResult?.data, message);
	},

	deleteAll: async (req: Request, res: Response) => {
		let success = false;
		let createResult = null;
		let message = '';
		try {
			createResult = await roleServices.deleteAll();
			success = true;
		} catch (deleteAllRoleError) {
			console.error('rolesController :: deleteall :: deleteAllRoleError :: ', deleteAllRoleError);
			message = deleteAllRoleError as string;
		}

		return commonUtils.sendResponse(res, 200, success, createResult?.data, message);
	}
};
