import { join } from "path";
import { SequelizeTypescriptMigration } from "sequelize-typescript-migration-lts";

const db = require("./models/index");

SequelizeTypescriptMigration.makeMigration(db.sequelize, {
  outDir: join(__dirname, "./migrations"),
  migrationName: "first-init-migration",
  preview: false
});
