import { DataTypes, Model, CreationOptional, InferAttributes, InferCreationAttributes } from "sequelize";
import Listing from "./listing";
import User from "./user";
import sequelize from "../sequelize-connection";
import { bool } from "aws-sdk/clients/signer";
import PropertyForRent from "./property_for_rent";

// for typeScript typing
export default class PropertyTenant extends Model<InferAttributes<PropertyTenant>, InferCreationAttributes<PropertyTenant>> {
  // Only Used for typescript to pick up intellisense and types
  // The Init function below are the actual DB columns
  declare id: CreationOptional<number>;
  declare firstName?: string;
  declare lastName?: string;
  declare email?: string;
  declare phoneNumber?: string;
  declare addressString?: string;
  declare rentalAgreementDate?: string;
  declare deposit?: number;
  declare isDepositPaid?: bool;
  declare outstandingRent?: number;
  declare isDepositReleased?: bool;
  declare propertyForRentId: number;
  declare tenancyStatus: "ongoing" | "ended";
  declare userId: number;
  declare User: CreationOptional<User>;
  declare PropertyForRent: CreationOptional<PropertyForRent>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

// allowNull defaults to true if not set
PropertyTenant.init(
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
      allowNull: true
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: true
    },
    rentalAgreementDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    deposit: {
      type: DataTypes.DECIMAL(20, 2),
      allowNull: true
    },
    isDepositPaid: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    outstandingRent: {
      type: DataTypes.DECIMAL(20, 2),
      allowNull: true
    },
    isDepositReleased: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    addressString: {
      type: DataTypes.STRING,
      allowNull: true
    },
    tenancyStatus: {
      type: DataTypes.STRING,
      allowNull: true
    }
  },
  {
    // Other model options
    sequelize,
    tableName: "property_tenants",
    timestamps: true,
    modelName: "PropertyTenant"
  }
);

PropertyForRent.hasMany(PropertyTenant, { foreignKey: "propertyForRentId" });
PropertyTenant.belongsTo(PropertyForRent, { foreignKey: "propertyForRentId" });

PropertyTenant.belongsTo(User, { foreignKey: { name: "userId", allowNull: false } });
User.hasOne(PropertyTenant, { foreignKey: "userId" });
