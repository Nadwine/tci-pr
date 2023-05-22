"use strict";
exports.__esModule = true;
var path_1 = require("path");
var sequelize_typescript_migration_lts_1 = require("sequelize-typescript-migration-lts");
var sequelize = require("./sequelize-connection");
await sequelize_typescript_migration_lts_1.SequelizeTypescriptMigration.makeMigration(sequelize, {
    outDir: (0, path_1.join)(__dirname, "./migrations"),
    migrationName: "first-init-migration",
    preview: false
});
