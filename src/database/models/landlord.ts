import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional } from "sequelize";
import sequelize from "../sequelize-connection";
import User from "./user";

// for typeScript typing
export default class Landlord extends Model<InferAttributes<Landlord>, InferCreationAttributes<Landlord>> {
  // Only Used for typescript to pick up intellisense and types
  // The Init function below are the actual DB columns
  declare id: CreationOptional<number>;
  declare verified: boolean;
  declare userId: number;
  declare phone: CreationOptional<number>;
  declare email: CreationOptional<string>;
  declare address: CreationOptional<string>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

// allowNull defaults to true if not set
Landlord.init(
  // @ts-ignore
  {
    // Model attributes are defined here
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true
    }
  },
  {
    // Other model options go here
    sequelize,
    tableName: "landlords",
    timestamps: true,
    modelName: "Landlord"
  }
);

Landlord.belongsTo(User, { foreignKey: "userId" });
