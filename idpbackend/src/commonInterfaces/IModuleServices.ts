type ORDER_BY_DIRECTION_T = 'asc' | 'desc';

type FIND_ALL_FILTER_OPTONS_T = {
	[kye in string]: string | number | boolean;
};

interface IModuleServiceResult {
	data: any;
	message: string | null;
	success: boolean;
}

interface IPagingOptions {
	record?: number;
	offset?: number;
	sortByColumn?: string;
	oderByDirection?: ORDER_BY_DIRECTION_T;
}


interface IModuleBaseService {
	create: (createData: any) => Promise<IModuleServiceResult>;
	findAll: (findAllFilterOptions?: FIND_ALL_FILTER_OPTONS_T) => Promise<IModuleServiceResult>;
	findOne: (_id: string | number) => Promise<IModuleServiceResult>;
	update: (_id: string | number, updateData: any) => Promise<IModuleServiceResult>;
	deleteOne: (_id: string | number) => Promise<IModuleServiceResult>;
	deleteAll: () => Promise<IModuleServiceResult>;
}

export {  IModuleServiceResult, IModuleBaseService, IPagingOptions, FIND_ALL_FILTER_OPTONS_T };
