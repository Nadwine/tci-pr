import { DataTypes, Model, CreationOptional, InferAttributes, InferCreationAttributes } from "sequelize";
import Listing from "./listing";
import sequelize from "../sequelize-connection";

export default class ListingMedia extends Model<InferAttributes<ListingMedia>, InferCreationAttributes<ListingMedia>> {
  // Only Used for typescript to pick up intellisense and types
  // The Init function below are the actual DB columns
  declare id: CreationOptional<number>;
  declare mediaType: string;
  declare fileFormat: string;
  declare s3BucketKey: string;
  declare mediaUrl: string;
  declare listingId: number;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

// allowNull defaults to true if not set
ListingMedia.init(
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
    fileFormat: {
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
    }
  },
  {
    // Other model options
    sequelize,
    tableName: "listing_media",
    timestamps: true,
    modelName: "ListingMedia"
  }
);
// Media.belongsTo(Project, { foreignKey: 'listingId' })
Listing.hasMany(ListingMedia, { foreignKey: "listingId" });
