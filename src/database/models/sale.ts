import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional } from "sequelize";
import sequelize from "../sequelize-connection";

// for typeScript typing
export default class Sale extends Model<InferAttributes<Sale>, InferCreationAttributes<Sale>> {
  // Only Used for typescript to pick up intellisense and types
  // The Init function below are the actual DB columns
  declare id: CreationOptional<number>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

// allowNull defaults to true if not set
Sale.init(
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
    tableName: "sales",
    timestamps: true,
    modelName: "Sale"
  }
);
