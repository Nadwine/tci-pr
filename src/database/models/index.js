"use strict";

/* --------------------------------------------------------------------*
 |
 |      This File is used to initialize ORM Models
 |          (starting point for sequelize)
 |       executed on server startup in /server/bin/www
 |
 * __________________________________________________________________ */
const fs = require("fs");
const path = require("path");
const { Sequelize } = require("sequelize");
const basename = path.basename(__filename);
const config = require("../config/config");
const db = {};

console.log("using DB Config >", config);
//@ts-ignore
const sequelize = new Sequelize(config.database ?? "", config.username, config.password, config);

fs.readdirSync(__dirname)
  .filter(file => {
    return file.indexOf(".") !== 0 && file !== basename && (file.slice(-3) === ".js" || file.slice(-3) === ".ts");
  })
  .forEach(file => {
    //@ts-ignore
    const model = require(path.join(__dirname, file)).default; //(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
    sequelize.modelManager.addModel(model);
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
