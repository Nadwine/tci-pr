import { Sequelize } from "sequelize";
// @ts-ignore
// path from seqalize root to db path
const sequelize = process.env.SQLITE
  ? // @ts-ignore
    new Sequelize({
      storage: "./tcipr.db",
      dialect: String("sqlite"),
      logging: process.env.DB_QUERY_LOG === "true" ? true : false
    })
  : // @ts-ignore
    new Sequelize({
      username: String(process.env.DB_USER || "empty"),
      password: String(process.env.DB_PASSWORD || "empty"),
      database: String(process.env.DATABASE || "empty"),
      host: String(process.env.DB_HOST || "empty"),
      dialect: String(process.env.DB_DIALECT || "postgres"),
      logging: process.env.DB_QUERY_LOG === "true" ? true : false
    });

export default sequelize;
