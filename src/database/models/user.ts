import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional } from "sequelize";
import sequelize from "../sequelize-connection";
import EnquiryConversation from "./enquiry_conversation";
import { AccountTypeEnum } from "../../../types/enums";
import Admin from "./admin";
import ListingLandlord from "./listing_landlord";
import Profile from "./profile";

// for typeScript typing
export default class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  // Only Used for typescript to pick up intellisense and types
  // The Init function below are the actual DB columns
  declare id: CreationOptional<number>;
  declare username?: string;
  declare email: string;
  declare company: string;
  declare password: string;
  declare verified: boolean;
  declare accountType?: AccountTypeEnum; // landlord, admin, tenant/user
  declare termsAccepted?: boolean;
  declare Admin?: CreationOptional<Admin>;
  declare ListingLandlord?: CreationOptional<ListingLandlord>;
  declare Profile?: CreationOptional<Profile>;
  declare ProjectTenants: CreationOptional<EnquiryConversation[]>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

// allowNull defaults to true if not set
User.init(
  // @ts-ignore
  {
    // Model attributes are defined here
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    username: {
      type: DataTypes.STRING,
      allowNull: true
      // defaultValue: "John Doe"
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    company: {
      type: DataTypes.STRING,
      allowNull: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    accountType: {
      type: DataTypes.STRING,
      defaultValue: false
    },
    termsAccepted: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  },
  {
    // Other model options go here
    sequelize,
    tableName: "users",
    timestamps: true,
    modelName: "User"
  }
);
