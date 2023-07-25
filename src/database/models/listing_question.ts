import { DataTypes, Model, CreationOptional, InferAttributes, InferCreationAttributes } from "sequelize";
import sequelize from "../sequelize-connection";
import Listing from "./listing";

// for typeScript typing
export default class ListingQuestion extends Model<InferAttributes<ListingQuestion>, InferCreationAttributes<ListingQuestion>> {
  // Only Used for typescript to pick up intellisense and types
  // The Init function below are the actual DB columns
  declare id: CreationOptional<number>;
  declare listingId: number;
  declare text: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

// allowNull defaults to true if not set
// const User = sequelize.define('User', {
ListingQuestion.init(
  //@ts-ignore
  {
    // Model attributes are defined here
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    text: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  },
  {
    // Other model options go here
    sequelize,
    tableName: "listing_questions",
    timestamps: true,
    modelName: "ListingQuestion"
  }
);

ListingQuestion.belongsTo(Listing, { foreignKey: "listingId" });
Listing.hasMany(ListingQuestion, { foreignKey: "listingId" }); // reverse association
