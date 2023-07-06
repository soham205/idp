require("dotenv").config();

module.exports = {
  local: {
    username: process.env.DB_USER || "",
    password: process.env.DB_USER_PWD || "",
    database: process.env.DB_NAME || "",
    host: process.env.DB_HOST || "",
    dialect: process.env.DB_DIALECT || "",
    storage: process.env.DB_STORAGE_PATH || "",
  },
  develop: {
    username: process.env.DB_USER || "",
    password: process.env.DB_USER_PWD || "",
    database: process.env.DB_NAME || "",
    host: process.env.DB_HOST || "",
    dialect: process.env.DB_DIALECT,
    storage: process.env.DB_STORAGE_PATH
  },
  prod: {
    username: process.env.DB_USER || "",
    password: process.env.DB_USER_PWD || "",
    database: process.env.DB_NAME || "",
    host: process.env.DB_HOST || "",
    dialect: process.env.DB_DIALECT,
    storage: process.env.DB_STORAGE_PATH || ""
  },
}