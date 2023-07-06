import { Dialect } from 'sequelize';

interface IDbConfig {
	host: string;
	port: number;
	dialect: Dialect;
	storage: string;
	logging: boolean;
	dbName: string;
	dbUser: string;
	dbPassword: string;
}

type DatabaseFieldType =
	| 'BIGINT'
	| 'BOOLEAN'
	| 'FLOAT'
	| 'INTEGER'
	| 'TEXT'
	| 'VARCHAR'
	| `VARCHAR(${number | ''})`
	| `DATE`
	| `uuid`;

interface IForeignKeyContraint {
	referenceTableName: string;
	referenceFieldName: string;
}

interface IModelSchema {
	fieldName: string;
	fieldType: DatabaseFieldType;
	fieldConstraints?: IFieldConstraints;
	foreignKeyContraints?: IForeignKeyContraint;
}

interface IFieldConstraints {
	autoIncrement?: boolean;
	allowNull?: boolean;
	unique: boolean;
	isPrimary?: boolean;
	defaultValue?: string | boolean | number | null;
}

export { DatabaseFieldType, IModelSchema, IFieldConstraints, IDbConfig };
