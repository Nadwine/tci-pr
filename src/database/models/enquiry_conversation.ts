import { DataTypes, Model, CreationOptional, InferAttributes, InferCreationAttributes } from "sequelize";
import sequelize from "../sequelize-connection";
import User from "./user";
import Listing from "./listing";
import Message from "./message";

// for typeScript typing
export default class EnquiryConversation extends Model<InferAttributes<EnquiryConversation>, InferCreationAttributes<EnquiryConversation>> {
  // Only Used for typescript to pick up intellisense and types
  // The Init function below are the actual DB columns
  declare id: CreationOptional<number>;
  declare listingId: number;
  declare userId: number;
  declare intro_message: string;
  declare Messages: CreationOptional<Message[]>;
  declare User: CreationOptional<User>;
  declare Listing: CreationOptional<Listing>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

// allowNull defaults to true if not set
// const User = sequelize.define('User', {
EnquiryConversation.init(
  //@ts-ignore
  {
    // Model attributes are defined here
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    intro_message: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  },
  {
    // Other model options go here
    sequelize,
    tableName: "enquiry_conversation",
    timestamps: true,
    modelName: "EnquiryConversation"
  }
);

EnquiryConversation.belongsTo(User, { foreignKey: "userId" });
User.hasMany(EnquiryConversation, { foreignKey: "userId" }); // reverse association
EnquiryConversation.belongsTo(Listing, { foreignKey: "listingId", onDelete: "CASCADE" });
Listing.hasMany(EnquiryConversation, { foreignKey: "listingId" }); // reverse association
