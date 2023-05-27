import { DataTypes, Model, CreationOptional, InferAttributes, InferCreationAttributes } from "sequelize";
import sequelize from "../sequelize-connection";
import User from "./user";
import Listing from "./listing";

// for typeScript typing
export default class ListingEnquiry extends Model<
  InferAttributes<ListingEnquiry>,
  InferCreationAttributes<ListingEnquiry>
> {
  // Only Used for typescript to pick up intellisense and types
  // The Init function below are the actual DB columns
  declare id: CreationOptional<number>;
  declare userId: number;
  declare listingId: number;
  declare message: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

// allowNull defaults to true if not set
// const User = sequelize.define('User', {
ListingEnquiry.init(
  //@ts-ignore
  {
    // Model attributes are defined here
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  },
  {
    // Other model options go here
    sequelize,
    tableName: "listing_enquires",
    timestamps: true,
    modelName: "ListingEnquiry"
  }
);

ListingEnquiry.belongsTo(User, { foreignKey: "userId" });
User.hasMany(ListingEnquiry, { foreignKey: "userId" }); // reverse association
ListingEnquiry.belongsTo(Listing, { foreignKey: "listingId" });
Listing.hasMany(ListingEnquiry, { foreignKey: "listingId" }); // reverse association
