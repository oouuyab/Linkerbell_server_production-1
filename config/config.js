require('dotenv').config();
const env = process.env;

const development = {
  username: env.DB_USERNAME,
  password: env.DB_PASSWORD,
  database: env.DB_DBNAME,
  host: env.DB_HOST,
  dialect: env.DB_DIALECT,
  port: env.DB_PORT,
  timezone: '+09:00',
};

const production = {
  username: env.DB_USERNAME,
  password: env.DB_PASSWORD,
  database: env.DB_DBNAME,
  host: env.DB_HOST,
  dialect: env.DB_DIALECT,
  port: env.DB_PORT,
  timezone: '+09:00',
};

const test = {
  username: env.DB_USERNAME,
  password: env.DB_PASSWORD,
  database: env.DB_DBNAME,
  host: env.DB_HOST,
  dialect: env.DB_DIALECT,
  port: env.DB_PORT,
  timezone: '+09:00',
};

module.exports = { development, production, test };
