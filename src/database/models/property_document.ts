import { DataTypes, Model, CreationOptional, InferAttributes, InferCreationAttributes } from "sequelize";
import sequelize from "../sequelize-connection";
import PropertyForRent from "./property_for_rent";

export default class PropertyDocument extends Model<InferAttributes<PropertyDocument>, InferCreationAttributes<PropertyDocument>> {
  // Only Used for typescript to pick up intellisense and types
  // The Init function below are the actual DB columns
  declare id: CreationOptional<number>;
  declare mediaType: string;
  declare mediaFormat: string;
  declare s3BucketKey: string;
  declare mediaUrl: string;
  declare label: string;
  declare propertyForRentId: number;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

// allowNull defaults to true if not set
PropertyDocument.init(
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
    }
  },
  {
    // Other model options
    sequelize,
    tableName: "property_documents",
    timestamps: true,
    modelName: "PropertyDocument"
  }
);

PropertyForRent.hasMany(PropertyDocument, { foreignKey: "propertyForRentId" });
