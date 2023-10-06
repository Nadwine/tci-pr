import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional } from "sequelize";
import sequelize from "../sequelize-connection";
import Listing from "./listing";

// for typeScript typing
export default class PropertyForSale extends Model<InferAttributes<PropertyForSale>, InferCreationAttributes<PropertyForSale>> {
  // Only Used for typescript to pick up intellisense and types
  // The Init function below are the actual DB columns
  declare id: CreationOptional<number>;
  declare sqFt: number;
  declare numOfRooms: number;
  declare numOfBathRooms: number;
  declare availability: Date;
  declare isFurnished: boolean;
  declare saleAmount: number;
  declare listingId: number;
  declare Listing: CreationOptional<Listing>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

// allowNull defaults to true if not set
PropertyForSale.init(
  // @ts-ignore
  {
    // Model attributes are defined here
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    sqFt: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    availability: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    numOfRooms: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    numOfBathRooms: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    isFurnished: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    saleAmount: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  {
    // Other model options go here
    sequelize,
    tableName: "property_for_sale",
    timestamps: true,
    modelName: "PropertyForSale"
  }
);

Listing.hasOne(PropertyForSale, { foreignKey: "listingId", onDelete: "CASCADE" });
