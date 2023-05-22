import { Sequelize, DataTypes, Model, CreationOptional, InferAttributes, InferCreationAttributes } from "sequelize";
import Property from "./property";
// path from seqalize root to db path
// const sequelize = new Sequelize({
//   username: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DATABASE,
//   host: process.env.DB_HOST,
//   dialect: process.env.DB_DIALECT,
//   logging: process.env.DB_QUERY_LOG === "true" ? true : false
// });
import sequelize from "../sequelize-connection";

export default class Location extends Model<InferAttributes<Location>, InferCreationAttributes<Location>> {
  // Only Used for typescript to pick up intellisense and types
  // The Init function below are the actual DB columns
  declare id: CreationOptional<number>;
  declare address: string;
  declare city: string;
  declare postcode: string;
  declare country: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

// allowNull defaults to true if not set
Location.init(
  // @ts-ignore
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false
    },
    postcode: {
      type: DataTypes.STRING,
      allowNull: false
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    // Other model options
    sequelize,
    tableName: "locations",
    timestamps: true,
    modelName: "Location"
  }
);

Property.hasOne(Location, { foreignKey: "propertyId" });
