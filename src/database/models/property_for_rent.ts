import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional } from "sequelize";
import sequelize from "../sequelize-connection";
import Listing from "./listing";
import Address from "./address";

// for typeScript typing
export default class PropertyForRent extends Model<
  InferAttributes<PropertyForRent>,
  InferCreationAttributes<PropertyForRent>
> {
  // Only Used for typescript to pick up intellisense and types
  // The Init function below are the actual DB columns
  declare id: CreationOptional<number>;
  declare numOfRooms: number;
  declare numOfBathRooms: number;
  declare maxTenant: number;
  declare sqFt: number;
  declare billsIncluded: boolean;
  declare availability: Date;
  declare Address: CreationOptional<Address>;
  declare Listing: CreationOptional<Listing>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

// Link landlord id

// allowNull defaults to true if not set
PropertyForRent.init(
  // @ts-ignore
  {
    // Model attributes are defined here
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    numOfRooms: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    numOfBathRooms: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    maxTenant: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    sqFt: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    availability: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    billsIncluded: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    }
  },
  {
    // Other model options go here
    sequelize,
    tableName: "property_for_rent",
    timestamps: true,
    modelName: "PropertyForRent"
  }
);

Listing.hasOne(PropertyForRent, { foreignKey: "listingId" });
