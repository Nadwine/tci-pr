import { DataTypes, Model, CreationOptional, InferAttributes, InferCreationAttributes } from "sequelize";
import sequelize from "../sequelize-connection";
import ListingEnquiry from "./listing_enquiry";
import Landlord from "./landlord";

// for typeScript typing
export default class Listing extends Model<InferAttributes<Listing>, InferCreationAttributes<Listing>> {
  // Only Used for typescript to pick up intellisense and types
  // The Init function below are the actual DB columns
  declare id: CreationOptional<number>;
  declare title: string;
  declare description: string;
  declare listingType: string; // sales, rent
  declare landlordId?: number;
  declare Landlord: CreationOptional<Landlord>;
  declare PropertyEnquiries: CreationOptional<ListingEnquiry>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  // property type, rooms, price, advert type (rent, sale)
}

// allowNull defaults to true if not set
Listing.init(
  // @ts-ignore
  {
    // Model attributes are defined here
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    listingType: {
      type: DataTypes.STRING, // Sale , Rent
      allowNull: false
    }
  },
  {
    // Other model options
    sequelize,
    tableName: "listings",
    timestamps: true,
    modelName: "Listing"
  }
);
Listing.belongsTo(Landlord, { foreignKey: "landlordId", foreignKeyConstraint: true });
