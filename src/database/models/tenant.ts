import { DataTypes, Model, CreationOptional, InferAttributes, InferCreationAttributes } from "sequelize";
import User from "./user";
import sequelize from "../sequelize-connection";
import { bool } from "aws-sdk/clients/signer";
import PropertyForRent from "./property_for_rent";
import Tenancy from "./tenancy";
import { TenancyStatusEnum } from "../../utils/statusSequence";

// for typeScript typing
export default class Tenant extends Model<InferAttributes<Tenant>, InferCreationAttributes<Tenant>> {
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
  declare tenancyStatus: TenancyStatusEnum;
  declare tenancyId: CreationOptional<number>;
  declare isLeadTenant: boolean;
  declare userId: number;
  declare Tenancy: CreationOptional<Tenancy>;
  declare User: CreationOptional<User>;
  declare PropertyForRent: CreationOptional<PropertyForRent>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

// allowNull defaults to true if not set
Tenant.init(
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
    isLeadTenant: {
      type: DataTypes.BOOLEAN,
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
    tableName: "tenants",
    timestamps: true,
    modelName: "Tenant"
  }
);

Tenant.belongsTo(User, { foreignKey: { name: "userId" } });
User.hasOne(Tenant, { foreignKey: "userId" });

Tenant.belongsTo(Tenancy, { foreignKey: { name: "tenancyId" } });
Tenancy.hasMany(Tenant, { foreignKey: "tenancyId" });
