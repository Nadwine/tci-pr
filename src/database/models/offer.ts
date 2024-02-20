import { DataTypes, Model, CreationOptional, InferAttributes, InferCreationAttributes } from "sequelize";
import sequelize from "../sequelize-connection";
import User from "./user";
import Listing from "./listing";

// for typeScript typing
export default class Offer extends Model<InferAttributes<Offer>, InferCreationAttributes<Offer>> {
  // Only Used for typescript to pick up intellisense and types
  // The Init function below are the actual DB columns
  declare id: CreationOptional<number>;
  declare amount: number;
  declare tenancyLengthDays: number;
  declare preferredStartDate: string;
  declare listingId: CreationOptional<number>;
  declare userId: CreationOptional<number>;
}

Offer.init(
  // @ts-ignore
  {
    // Model attributes are defined here
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    amount: {
      type: DataTypes.DECIMAL(20, 2),
      allowNull: false
    },
    tenancyLengthDays: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    preferredStartDate: {
      type: DataTypes.DATE,
      allowNull: false
    }
  },
  {
    // Other model options go here
    sequelize,
    tableName: "offers",
    timestamps: true,
    modelName: "Offer"
  }
);
Offer.belongsTo(User, { foreignKey: "userId" });
User.hasMany(Offer, { foreignKey: "userId" }); // reverse association
Listing.hasMany(Offer, { foreignKey: "listingId" });
Offer.belongsTo(Listing, { foreignKey: "listingId" });
