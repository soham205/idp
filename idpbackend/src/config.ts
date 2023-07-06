import { Dialect } from "sequelize";

import { IDbConfig } from "./plugins/sequelize-wrapper/interfaces";


type NODE_ENV_T = 'local' | 'develop' | 'stage' | 'prod';

export const ENVIRONMENT: NODE_ENV_T = process.env.NODE_ENV as NODE_ENV_T;
export const PORT = process.env.PORT;

export const EXPRESS_SESSION_PROPS = {
  EXPRESS_SESSION_SECRET: process.env.EXPRESS_SESSION_SECRET || "",
  EXPRESS_SESSION_PRESENT: false,
  PROXY: true,
  RESAVE: false,
  SAVE_UNINITIALIZED: false,
  COOKIE_PROPS: {
    MAX_AGE: 10,
    SECURE: true,
    SAME_SITE: "lax",
    DOMAIN: "vcardBackend.com",
  },
};
export const JWT_SECRET = 'jaksdf;alksdjf;asdfk';

export const BASE_ENDPOINT = process.env.BASE_ENDPOINT;

export const API_VERSION = process.env.API_VERSION || "v1";

export const ENVIRONMENTS = {
  LOCAL: process.env.NODE_LOCAL_ENV || "local",
  DEVELOP: process.env.NODE_DEVELOP_ENV || "develop",
  STAGE: process.env.NODE_STAGE_ENV || "stage",
  PROD: process.env.NODE_PROD_ENV || "prod",
};

export const DATABASE = {
  DB_NAME: process.env.DB_NAME || "",
  HOST: process.env.DB_HOST || "",
  PORT: process.env.DB_PORT || "",
  USER: process.env.DB_USER || "",
  PASSWORD: process.env.DB_USER_PWD || "",
  DB_DIALECT: process.env.DB_DIALECT || "",
  DB_STORAGE_PATH: process.env.DB_STORAGE_PATH || '',
  LOGGING: process.env.LOGGING === 'true'
};

export const PUBLIC_DIRECTORY = process.env.PUBLIC_DIRECTORY || "/public";

export const BODY_PARSER_JSON_SIZE_LIMIT = {
  MEMORY_UNIT: process.env.MEMORY_UNIT || "mb",
  MEMORY_SIZE: process.env.MEMORY_SIZE || "10",
};

export const MULTER_PROPS = {
  FILE_SIZE_LIMIT: process.env.FILE_SIZE_LIMIT || 0,
  UPLOAD_DIRECTORY: process.env.UPLOAD_DIRECTORY || "",
};

export const dbConfig: IDbConfig = {
  dbName: DATABASE.DB_NAME, dbPassword: DATABASE.PASSWORD,
  host: DATABASE.HOST,
  port: Number(DATABASE.PORT),
  dialect: DATABASE.DB_DIALECT as Dialect,
  storage: DATABASE.DB_STORAGE_PATH,
  logging: DATABASE.LOGGING,
  dbUser: DATABASE.USER
}
