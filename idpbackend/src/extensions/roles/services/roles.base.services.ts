import {
	FIND_ALL_FILTER_OPTONS_T,
	IModuleBaseService,
	IModuleServiceResult,
} from '../../../commonInterfaces/IModuleServices';
import { ICreateRoleEntryFields, IUpdateRoleEntryFields, RolesModel } from '../models/roles.models';

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
		RolesModel.findAll({
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
		RolesModel.count({ where: filterOptions ? { ...filterOptions } : {} })
			.then((recrodCount) => {
				resolve(recrodCount);
			})
			.catch((countQueryError) => {
				reject(countQueryError);
			});
	});
}

const VcardBaseServices: IModuleBaseService = {
	create: function (createData: ICreateRoleEntryFields): Promise<IModuleServiceResult> {
		return new Promise((resolve, reject) => {
			RolesModel.create(createData)
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
	findOne: function (id: string | number): Promise<IModuleServiceResult> {
		return new Promise((resolve, reject) => {
			RolesModel.findAll({ where: { id } })
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
	update: function (id: string | number, updateData: IUpdateRoleEntryFields): Promise<IModuleServiceResult> {
		return new Promise((resolve, reject) => {
			RolesModel.update(updateData, {
				where: {
					id
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
	deleteOne: function (id: string | number): Promise<IModuleServiceResult> {
		return new Promise((resolve, reject) => {
			RolesModel.findAll({ where: { id } })
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
			RolesModel.destroy()
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

