import { DataTypes, DataType, ModelAttributes, Sequelize, ModelAttributeColumnOptions } from 'sequelize';

import { IModelSchema, DatabaseFieldType, IDbConfig } from './interfaces';

function getSequlizeDataType(filedType: DatabaseFieldType): DataType {
	let databaseFieldType: DataType;
	switch (filedType) {
		case 'INTEGER':
			databaseFieldType = DataTypes.INTEGER;
			break;
		case 'BIGINT':
			databaseFieldType = DataTypes.BIGINT;
			break;
		case 'BOOLEAN':
			databaseFieldType = DataTypes.BOOLEAN;
			break;
		case 'FLOAT':
			databaseFieldType = DataTypes.FLOAT;
			break;
		case 'TEXT':
			databaseFieldType = DataTypes.TEXT;
			break;
		case 'VARCHAR':
			databaseFieldType = DataTypes.STRING;
			break;
		case 'VARCHAR()':
			databaseFieldType = DataTypes.STRING;
			break;
		case 'DATE':
			databaseFieldType = DataTypes.DATE;
		case 'uuid':
			databaseFieldType = DataTypes.UUIDV4;
			break;
		default:
			throw new Error('Invalid data type supplied.');
	}
	return databaseFieldType;
}

let databaseHandler: Sequelize | undefined;

export const sequelizeWrapper = {
	getDatabaseHandler: function (dbConfig: IDbConfig): Sequelize {
		if (!databaseHandler) {
			databaseHandler = new Sequelize(dbConfig.dbName, dbConfig.dbUser, dbConfig.dbPassword, {
				host: dbConfig.host,
				port: dbConfig.port,
				dialect: dbConfig.dialect,
				storage: dbConfig.storage,
				logging: dbConfig.logging
			});
		}
		return databaseHandler;
	},

	connectDatabase: function (dbConfig: IDbConfig) {
		return new Promise<void>((resolve, reject) => {
			if (!databaseHandler) {
				databaseHandler = this.getDatabaseHandler(dbConfig);
			}
			databaseHandler
				.sync()
				.then(() => {
					resolve();
				})
				.catch((error) => {
					reject(error);
				});
		});
	},
	// ModelAttributeColumnOptions

	modelResolve: function (dbConfig: IDbConfig, modelSchema: IModelSchema[], modelName: string) {
		let modelObject: ModelAttributes = {};
		try {
			for (const schemaItem of modelSchema) {
				let modelFieldItem: ModelAttributes;
				let modelFieldDetails: ModelAttributeColumnOptions = {
					type: getSequlizeDataType(schemaItem.fieldType),
					autoIncrement:
						schemaItem.fieldConstraints && typeof schemaItem.fieldConstraints.autoIncrement === 'boolean'
							? schemaItem.fieldConstraints.autoIncrement
							: false,
					primaryKey:
						schemaItem.fieldConstraints && typeof schemaItem.fieldConstraints.isPrimary === 'boolean'
							? schemaItem.fieldConstraints.isPrimary
							: false,
					references: {
						model:
							schemaItem && schemaItem.foreignKeyContraints && schemaItem.foreignKeyContraints.referenceTableName
								? schemaItem.foreignKeyContraints.referenceTableName
								: '',
						key:
							schemaItem.foreignKeyContraints && schemaItem.foreignKeyContraints.referenceFieldName
								? schemaItem.foreignKeyContraints.referenceFieldName
								: ''
					},
					allowNull:
						schemaItem.fieldConstraints && typeof schemaItem.fieldConstraints.allowNull === 'boolean'
							? schemaItem.fieldConstraints.allowNull
							: true
				};
				modelFieldItem = { [schemaItem.fieldName]: modelFieldDetails };
				if (!schemaItem.foreignKeyContraints) {
					delete modelFieldDetails.references;
				}

				if (
					schemaItem.fieldConstraints &&
					(typeof schemaItem.fieldConstraints.defaultValue == 'boolean' ||
						typeof schemaItem.fieldConstraints.defaultValue == 'string' ||
						typeof schemaItem.fieldConstraints.defaultValue == 'number')
				) {
					modelFieldDetails.defaultValue =
						schemaItem.fieldConstraints &&
						(typeof schemaItem.fieldConstraints.defaultValue == 'boolean' ||
							typeof schemaItem.fieldConstraints.defaultValue == 'string' ||
							typeof schemaItem.fieldConstraints.defaultValue == 'number')
							? schemaItem.fieldConstraints.defaultValue
							: null;
				}

				modelObject = { ...modelObject, ...modelFieldItem };
			}
		} catch (makeSequlizeModelError) {
			throw new Error(makeSequlizeModelError as string);
		}
		try {
			console.log('modelObject', modelObject);

			let test = this.getDatabaseHandler(dbConfig).define(modelName, modelObject, {
				timestamps: true,
				freezeTableName: true
			});
			console.log('test', test);

			return test;
		} catch (createModelError) {
			throw new Error(createModelError as string);
		}
	}
};
