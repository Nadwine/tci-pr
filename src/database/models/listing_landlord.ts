import { DataTypes, Model, CreationOptional, InferAttributes, InferCreationAttributes } from "sequelize";
import User from "./user";
import sequelize from "../sequelize-connection";

// for typeScript typing
export default class ListingLandlord extends Model<InferAttributes<ListingLandlord>, InferCreationAttributes<ListingLandlord>> {
  // Only Used for typescript to pick up intellisense and types
  // The Init function below are the actual DB columns
  declare id: CreationOptional<number>;
  declare firstName?: string;
  declare lastName?: string;
  declare phoneNumber?: string;
  declare homeIsland?: string;
  declare addressString?: string;
  declare cardDetails?: any;
  declare stripeConnectId?: string;
  declare userId: number;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

// allowNull defaults to true if not set
ListingLandlord.init(
  // @ts-ignore
  {
    // Model attributes are defined here
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: true
    },
    homeIsland: {
      type: DataTypes.STRING,
      allowNull: true
    },
    addressString: {
      type: DataTypes.STRING,
      allowNull: true
    },
    cardDetails: {
      type: DataTypes.JSON,
      allowNull: true
    },
    stripeConnectId: {
      type: DataTypes.STRING,
      allowNull: true
    }
  },
  {
    // Other model options
    sequelize,
    tableName: "listing_landlords",
    timestamps: true,
    modelName: "ListingLandlord"
  }
);

ListingLandlord.belongsTo(User, { foreignKey: { name: "userId", allowNull: false } });
User.hasOne(ListingLandlord, { foreignKey: "userId" });
