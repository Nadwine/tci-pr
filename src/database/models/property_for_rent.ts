import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional } from "sequelize";
import sequelize from "../sequelize-connection";
import Listing from "./listing";
import Rent from "./rent";
import { float } from "aws-sdk/clients/cloudfront";

// for typeScript typing
export default class PropertyForRent extends Model<
  InferAttributes<PropertyForRent>,
  InferCreationAttributes<PropertyForRent>
> {
  // Only Used for typescript to pick up intellisense and types
  // The Init function below are the actual DB columns
  declare id: CreationOptional<number>;
  declare room: number;
  declare pricePerMonth: float;
  declare maxTenant: number;
  // declare square_ft: CreationOptional<number>;
  declare address: number;
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
PropertyForRent.belongsTo(Rent, { foreignKey: "saleId" });
