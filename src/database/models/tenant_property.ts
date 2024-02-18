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
  declare rentalAgreementDate: string;
  declare deposit: number;
  declare isDepositPaid: bool;
  declare outstandingRent?: number;
  declare isDepositReleased: bool;
  // Add User, Property and Landlord
  declare userId: number;
  declare User: CreationOptional<User>;
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
