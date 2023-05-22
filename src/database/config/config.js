const path = require("path");
if (process.env.NODE_ENV) {
  if (process.env.GENERATE_MIG) {
    require("dotenv").config({
      path: path.join(__dirname, `../../../../.env.${process.env.NODE_ENV}`)
    });
  } else {
    require("dotenv").config({
      path: path.join(__dirname, `../../../.env.${process.env.NODE_ENV}`)
    });
  }
  console.log(`connecting database for environment >> ${process.env.NODE_ENV}`);
} else {
  console.error("No NODE_ENV provided");
  process.exit();
}
module.exports = {
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DATABASE,
  host: process.env.DB_HOST,
  dialect: process.env.DB_DIALECT,
  logging: process.env.DB_QUERY_LOG === "true" ? true : false
};
