import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional } from "sequelize";
import sequelize from "../sequelize-connection";

// for typeScript typing
export default class Rent extends Model<InferAttributes<Rent>, InferCreationAttributes<Rent>> {
  // Only Used for typescript to pick up intellisense and types
  // The Init function below are the actual DB columns
  declare id: CreationOptional<number>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

// allowNull defaults to true if not set
Rent.init(
  // @ts-ignore
  {
    // Model attributes are defined here
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    }
  },
  {
    // Other model options go here
    sequelize,
    tableName: "rents",
    timestamps: true,
    modelName: "Rent"
  }
);
