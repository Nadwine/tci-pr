import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional } from "sequelize";
import sequelize from "../sequelize-connection";
import Listing from "./listing";
import Sale from "./sale";

// for typeScript typing
export default class PropertyForSale extends Model<
  InferAttributes<PropertyForSale>,
  InferCreationAttributes<PropertyForSale>
> {
  // Only Used for typescript to pick up intellisense and types
  // The Init function below are the actual DB columns
  declare id: CreationOptional<number>;
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

Listing.hasOne(PropertyForSale, { foreignKey: "listingId" });
PropertyForSale.belongsTo(Sale, { foreignKey: "saleId" });
