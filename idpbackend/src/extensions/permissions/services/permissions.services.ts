import { IModuleBaseService, IModuleServiceResult } from '../../../commonInterfaces';
import { PermissionsModel } from '../models/permissions.models';
import PermissionBaseServices from './permissions.base.services';

interface IPermissionsServices extends IModuleBaseService {
	getSavedPermissionData: () => Promise<IModuleServiceResult>;
}

const PermissionServices: IPermissionsServices = {
	...PermissionBaseServices,
	getSavedPermissionData: function (): Promise<IModuleServiceResult> {
		return new Promise((resolve, reject) => {
			PermissionsModel.findAll()
				.then((savedPermissions) => {
					resolve({ data: savedPermissions, message: '', success: true });
				})
				.catch((getSavedPermissionError) => {
					reject(getSavedPermissionError);
				});
		});
	}
};

export default PermissionServices;
