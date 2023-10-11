import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional } from "sequelize";
import sequelize from "../sequelize-connection";
import User from "./user";

// for typeScript typing
export default class Admin extends Model<InferAttributes<Admin>, InferCreationAttributes<Admin>> {
  // Only Used for typescript to pick up intellisense and types
  // The Init function below are the actual DB columns
  declare id: CreationOptional<number>;
  declare verified: boolean;
  declare userId: number;
  declare phone: CreationOptional<number>;
  declare email: CreationOptional<string>;
  declare address: CreationOptional<string>;
  declare User?: CreationOptional<User>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

// allowNull defaults to true if not set
Admin.init(
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
    tableName: "admin",
    timestamps: true,
    modelName: "Admin"
  }
);

Admin.belongsTo(User, { foreignKey: "userId" });
User.hasOne(Admin, { foreignKey: "userId" });
