import {
	FIND_ALL_FILTER_OPTONS_T,
	IModuleBaseService,
	IModuleServiceResult,
} from '../../../commonInterfaces/IModuleServices';
import { ICreatePermissionEntryFields, IUpdatePermissionEntryFields, PermissionsModel } from '../models/permissions.models';

function findRecords(filterOptions?: FIND_ALL_FILTER_OPTONS_T) {
	return new Promise((resolve, reject) => {
		const offset: number = (filterOptions && Number(filterOptions.offset)) ? Number(filterOptions.offset) : 0;
		const record: number = (filterOptions && Number(filterOptions.record)) ? Number(filterOptions.record) : 10;

		const sortByColumn: string | null = filterOptions && typeof (filterOptions.sortByColumn) == 'string' ? filterOptions.sortByColumn : null;
		const orderByDirection: string | null = filterOptions && typeof (filterOptions.oderByDirection) == 'string' ? filterOptions.oderByDirection : null;
		let sortingProp: string[] = [];
		if (sortByColumn && orderByDirection) {
			sortingProp = [sortByColumn, orderByDirection];
		}
		if (filterOptions) {
			delete filterOptions.offset
			delete filterOptions.record
			delete filterOptions.sortByColumn
			delete filterOptions.orderByDirection
		}
		PermissionsModel.findAll({
			offset: offset * record,
			limit: record,
			order: sortingProp,
			where: filterOptions ? { ...filterOptions } : {}
		})
			.then((findAllResult) => {
				resolve(findAllResult);
			})
			.catch((findAllError) => {
				/**
				 *  Error Handling TO BE DONE.
				 */
				reject(findAllError);
			});
	});
}

function countRecords(filterOptions?: FIND_ALL_FILTER_OPTONS_T): Promise<number> {
	return new Promise((resolve, reject) => {
		if (filterOptions) {
			delete filterOptions.offset
			delete filterOptions.record
			delete filterOptions.sortByColumn
			delete filterOptions.orderByDirection
		}
		PermissionsModel.count({ where: filterOptions ? { ...filterOptions } : {} })
			.then((recrodCount) => {
				resolve(recrodCount);
			})
			.catch((countQueryError) => {
				reject(countQueryError);
			});
	});
}

const VcardBaseServices: IModuleBaseService = {
	create: function (createData: ICreatePermissionEntryFields): Promise<IModuleServiceResult> {
		return new Promise((resolve, reject) => {
			PermissionsModel.create(createData)
				.then((createResult) => {
					resolve({
						data: createResult,
						message: '',
						success: true
					});
				})
				.catch((createEntryError) => {
					/**
					 *  Error Handling TO BE DONE.
					 */
					reject(createEntryError);
				});
		});
	},
	findAll: function (
		filterOptions?: FIND_ALL_FILTER_OPTONS_T
	): Promise<IModuleServiceResult> {
		return new Promise((resolve, reject) => {
			Promise.all([findRecords(filterOptions), countRecords(filterOptions)])
				.then((findAllResult) => {
					const records = findAllResult[0];
					const count = findAllResult[1];
					resolve({
						data: {
							count,
							rows: records
						},
						message: '',
						success: true
					});
				})
				.catch((findAllEntriesError) => {
					/**
					 *  Error Handling TO BE DONE.
					 */
					reject(findAllEntriesError);
				});
		});
	},
	findOne: function (_id: string | number): Promise<IModuleServiceResult> {
		return new Promise((resolve, reject) => {
			PermissionsModel.findAll({ where: { _id } })
				.then((findOneEntryResult) => {
					resolve({
						data: findOneEntryResult,
						message: '',
						success: true
					});
				})
				.catch((findOneEntryResult) => {
					/**
					 *  Error Handling TO BE DONE.
					 */
					reject(findOneEntryResult);
				});
		});
	},
	update: function (_id: string | number, updateData: IUpdatePermissionEntryFields): Promise<IModuleServiceResult> {
		return new Promise((resolve, reject) => {
			PermissionsModel.update(updateData, {
				where: {
					_id
				}
			})
				.then((affectedRowCount) => {
					let success = false;
					if (affectedRowCount[0] > 0) {
						success = true;
					}
					resolve({
						data: null,
						message: '',
						success
					});
				})
				.catch((updateEntryError) => {
					/**
					 *  Error Handling TO BE DONE.
					 */
					reject(updateEntryError);
				});
		});
	},
	deleteOne: function (_id: string | number): Promise<IModuleServiceResult> {
		return new Promise((resolve, reject) => {
			PermissionsModel.findAll({ where: { _id } })
				.then((findOneEntryResult) => {
					resolve({
						data: findOneEntryResult,
						message: '',
						success: true
					});
				})
				.catch((deleteOneEntryError) => {
					/**
					 *  Error Handling TO BE DONE.
					 */
					reject(deleteOneEntryError);
				});
		});
	},
	deleteAll: function (): Promise<IModuleServiceResult> {
		return new Promise((resolve, reject) => {
			PermissionsModel.destroy()
				.then((deleteAllEntriesResult) => {
					resolve({
						data: deleteAllEntriesResult,
						message: '',
						success: true
					});
				})
				.catch((deleteAllEntriesError) => {
					/**
					 *  Error Handling TO BE DONE.
					 */
					reject(deleteAllEntriesError);
				});
		});
	}
};

export default VcardBaseServices;

