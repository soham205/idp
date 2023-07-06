import { differenceWith, findIndex } from 'lodash';

import { aclList } from './getAllRoutes';
import RolesServices from '../../../extensions/roles/services/roles.services';
import PermissionServices from './../../../extensions/permissions/services/permissions.services';
import { IRetrievePermissionEntry } from '../../../extensions/permissions/models/permissions.models';
import { IGroupWiseAcl } from '../../../plugins/staq-cms-plugin-acl/interfaces';

async function getAllAclPolicies() {
	let allAclPolicies = [];
	try {
		let allRoles = await RolesServices.getAllRoles();

		let allRouteInfo = await aclList.getAllRouteInfo();

		if (allRoles) {
			for (let role of allRoles) {
				for (let routeInfo of allRouteInfo) {
					let permissionInfo = { ...routeInfo };
					permissionInfo.group = role.name;

					allAclPolicies.push(permissionInfo);
				}
			}
		}
	} catch (getAllAclPoliciesError) {
		console.error('getAllAclPoliciesError :: ', getAllAclPoliciesError);
	}

	return allAclPolicies;
}

const aclPolicies = {
	updateAclPolicies: async () => {
		// permissionService.initBaseService(Permission);

		let allAclPolicies = await getAllAclPolicies();
		let savedPermissionResult = await PermissionServices.getSavedPermissionData();
		const savedPermissionData = <IRetrievePermissionEntry[]>savedPermissionResult.data;
		let aclPoliciesToBeAdded = differenceWith(allAclPolicies, savedPermissionData, (value, other) => {
			return (
				value.group === other.group &&
				value.resource === other.resource &&
				value.method === other.method &&
				value.displayMethod === other.displayMethod
			);
		});

		let aclPoliciesToBeRemoved = differenceWith(savedPermissionData, allAclPolicies, (value, other) => {
			return (
				value.group === other.group &&
				value.resource === other.resource &&
				value.method === other.method &&
				value.displayMethod === other.displayMethod
			);
		});

		for (let aclPolicyToBeAdded of aclPoliciesToBeAdded) {
			await PermissionServices.create(aclPolicyToBeAdded);
		}

		for (let aclPolicyToBeRemoved of aclPoliciesToBeRemoved) {
			await PermissionServices.deleteOne(aclPolicyToBeRemoved.id);
		}
	},

	getAclPolicies: async () => {
		let acl: IGroupWiseAcl[] = [];
		try {
			let savedPermissionData = await PermissionServices.getSavedPermissionData();

			for (let permission of savedPermissionData.data) {
				let groupName = permission.group;

				//if group does not exists in acl, add the group
				let groupIndex = findIndex(acl, (aclGroup) => aclGroup.group === groupName);
				if (groupIndex < 0) {
					acl.push({ group: groupName, permissions: [] });
					groupIndex = acl.length - 1;
				}

				//add permission to the group
				acl[groupIndex].permissions.push({
					resource: permission.resource,
					methods: [permission.method],
					action: permission.enable ? 'allow' : 'deny'
				});
			}
		} catch (getSavedPermissionError) {
			console.error('getSavedPermissionError :: ', getSavedPermissionError);
		}
		return acl;
	}
};

export { aclPolicies };
