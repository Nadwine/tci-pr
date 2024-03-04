import { DataTypes, Model, CreationOptional, InferAttributes, InferCreationAttributes } from "sequelize";
import Listing from "./listing";
import User from "./user";
import sequelize from "../sequelize-connection";
import { bool } from "aws-sdk/clients/signer";
import PropertyForRent from "./property_for_rent";
import Tenant from "./tenant";

// for typeScript typing
export default class Tenancy extends Model<InferAttributes<Tenancy>, InferCreationAttributes<Tenancy>> {
  // Only Used for typescript to pick up intellisense and types
  // The Init function below are the actual DB columns
  declare id: CreationOptional<number>;
  declare firstName?: string;
  declare lastName?: string;
  declare mainContactEmail?: string;
  declare mainContactNumber?: string;
  declare addressString?: string;
  declare rentalAgreementDate?: string;
  declare isPaymentTogether: boolean;
  declare deposit?: number;
  declare isDepositPaid?: boolean;
  declare outstandingRent?: number;
  declare isDepositReleased?: boolean;
  declare propertyForRentId: number;
  declare tenancyStatus: "awaiting-signatures" | "ongoing" | "ended";
  declare leadTenantid: number;
  declare userId: number;
  declare Tenants: CreationOptional<Tenant[]>;
  declare PropertyForRent: CreationOptional<PropertyForRent>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

// allowNull defaults to true if not set
Tenancy.init(
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
    mainContactEmail: {
      type: DataTypes.STRING,
      allowNull: true
    },
    mainContactNumber: {
      type: DataTypes.STRING,
      allowNull: true
    },
    rentalAgreementDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    isPaymentTogether: {
      type: DataTypes.BOOLEAN,
      allowNull: false
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
    leadTenantid: {
      type: DataTypes.INTEGER,
      allowNull: false
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
    tableName: "tenancies",
    timestamps: true,
    modelName: "Tenancy"
  }
);

PropertyForRent.hasMany(Tenancy, { foreignKey: "propertyForRentId" });
Tenancy.belongsTo(PropertyForRent, { foreignKey: "propertyForRentId" });
