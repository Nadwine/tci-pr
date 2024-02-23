import { DataTypes, Model, CreationOptional, InferAttributes, InferCreationAttributes } from "sequelize";
import sequelize from "../sequelize-connection";
import EnquiryConversation from "./enquiry_conversation";
import Admin from "./admin";
import { ListingTypeEnum } from "../../../types/enums";
import Address from "./address";
import PropertyForRent from "./property_for_rent";
import PropertyForSale from "./property_for_sale";
import ListingMedia from "./listing_media";
import ListingQuestion from "./listing_question";
import ListingLandlord from "./listing_landlord";
import { ListingStatusEnum } from "../../utils/listingStatusSequence";
import Offer from "./offer";

// for typeScript typing
export default class Listing extends Model<InferAttributes<Listing>, InferCreationAttributes<Listing>> {
  // Only Used for typescript to pick up intellisense and types
  // The Init function below are the actual DB columns
  declare id: CreationOptional<number>;
  declare title: string;
  declare description: string;
  declare listingType: ListingTypeEnum; // sales, rent
  declare adminId?: number;
  declare isApproved: boolean;
  declare stripePaymentLink?: { url: string; expiresAtUnixSeconds: number; generatedAt: string };
  declare category: "PropertyForRent";
  declare landlordId?: number;
  declare Admin?: CreationOptional<Admin>;
  declare listingManager: "landlord" | "admin";
  declare listingStatus: ListingStatusEnum;
  declare PropertyForRent: CreationOptional<PropertyForRent>;
  declare PropertyForSale: CreationOptional<PropertyForSale>;
  declare EnquiryConversations?: CreationOptional<EnquiryConversation[]>;
  declare ListingQuestions?: CreationOptional<ListingQuestion[]>;
  declare ListingMedia: CreationOptional<ListingMedia[]>;
  declare ListingLandlord?: CreationOptional<ListingLandlord>;
  declare Offers?: CreationOptional<Offer[]>;
  declare Address: CreationOptional<Address>;
  declare createdAt: CreationOptional<string>;
  declare updatedAt: CreationOptional<string>;
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
    },
    listingManager: {
      type: DataTypes.STRING,
      allowNull: false
    },
    listingStatus: {
      type: DataTypes.STRING,
      allowNull: false
    },
    isApproved: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    stripePaymentLink: {
      type: DataTypes.JSON,
      allowNull: true
    },
    category: {
      type: DataTypes.STRING,
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
Listing.belongsTo(Admin, { foreignKey: "adminId", foreignKeyConstraint: true });
Listing.belongsTo(ListingLandlord, { foreignKey: "landlordId" });
ListingLandlord.hasMany(Listing, { foreignKey: "landlordId" });
