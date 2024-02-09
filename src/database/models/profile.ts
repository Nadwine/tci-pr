import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional } from "sequelize";
import sequelize from "../sequelize-connection";
import User from "./user";
import Address from "./address";

// for typeScript typing
export default class Profile extends Model<InferAttributes<Profile>, InferCreationAttributes<Profile>> {
  // Only Used for typescript to pick up intellisense and types
  // The Init function below are the actual DB columns
  declare id: CreationOptional<number>;
  declare firstName: string;
  declare lastName: string;
  declare email: string;
  declare phonenumber: number;
  declare Address: CreationOptional<Address>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

// allowNull defaults to true if not set
Profile.init(
  // @ts-ignore
  {
    // Model attributes are defined here
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    phonenumber: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    // Other model options go here
    sequelize,
    tableName: "profiles",
    timestamps: true,
    modelName: "Profile"
  }
);

Profile.belongsTo(User, { foreignKey: "userId" });
Address.hasOne(Profile, { foreignKey: "addressId" }); // reverse association
