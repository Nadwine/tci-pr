import { DataTypes, Model, CreationOptional, InferAttributes, InferCreationAttributes } from "sequelize";
import sequelize from "../sequelize-connection";
import Tenancy from "./tenancy";

export default class TenancyDocument extends Model<InferAttributes<TenancyDocument>, InferCreationAttributes<TenancyDocument>> {
  // Only Used for typescript to pick up intellisense and types
  // The Init function below are the actual DB columns
  declare id: CreationOptional<number>;
  declare mediaType: string;
  declare mediaFormat: string;
  declare s3BucketKey: string;
  declare mediaUrl: string;
  declare label: string;
  declare documentType:
    | "tenancy-agreement"
    | "passport"
    | "national-insurance"
    | "drivers-license"
    | "job-contract"
    | "payslip"
    | "bank-statement"
    | "previous-tenancy-agreement";
  declare propertyForRentId: number;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

// allowNull defaults to true if not set
TenancyDocument.init(
  // @ts-ignore
  {
    // Model attributes are defined here
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    mediaType: {
      type: DataTypes.STRING,
      allowNull: false
    },
    mediaFormat: {
      type: DataTypes.STRING,
      allowNull: false
    },
    s3BucketKey: {
      type: DataTypes.STRING,
      allowNull: false
    },
    mediaUrl: {
      type: DataTypes.STRING,
      allowNull: false
    },
    label: {
      type: DataTypes.STRING,
      allowNull: true
    },
    documentType: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    // Other model options
    sequelize,
    tableName: "tenancy_documents",
    timestamps: true,
    modelName: "TenancyDocument"
  }
);

Tenancy.hasMany(TenancyDocument, { foreignKey: "tenancyId" });
TenancyDocument.belongsTo(Tenancy, { foreignKey: "tenancyId" });
