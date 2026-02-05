require('dotenv').config();

const dialect = process.env.DB_DIALECT || 'postgres';

module.exports = {
  development: {
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'student_portal',
    host: process.env.DB_HOST || 'localhost',
    dialect,
    logging: false
  },
  test: {
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'student_portal_test',
    host: process.env.DB_HOST || 'localhost',
    dialect,
    storage: process.env.DB_STORAGE || ':memory:',
    logging: false
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect,
    logging: false
  }
};
