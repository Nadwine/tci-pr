import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional } from "sequelize";
import sequelize from "../sequelize-connection";
import User from "./user";

// for typeScript typing
export default class Profile extends Model<InferAttributes<Profile>, InferCreationAttributes<Profile>> {
  // Only Used for typescript to pick up intellisense and types
  // The Init function below are the actual DB columns
  declare id: CreationOptional<number>;
  declare firstName: string;
  declare lastName: string;
  declare email: string;
  declare phoneNumber: number;
  declare addressLine1: string;
  declare addressLine2?: string;
  declare city: string;
  declare settlement: string;
  declare postcode: string;
  declare country: string;
  declare userId: number;
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
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false
    },
    addressLine1: {
      type: DataTypes.STRING,
      allowNull: true
    },
    addressLine2: {
      type: DataTypes.STRING,
      allowNull: true
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true
    },
    settlement: {
      type: DataTypes.STRING,
      allowNull: true
    },
    postcode: {
      type: DataTypes.STRING,
      allowNull: true
    },
    country: {
      type: DataTypes.STRING,
      allowNull: true
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
User.hasOne(Profile, { foreignKey: "userId" });
