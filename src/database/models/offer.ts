import { DataTypes, Model, CreationOptional, InferAttributes, InferCreationAttributes } from "sequelize";
import sequelize from "../sequelize-connection";
import User from "./user";
import Listing from "./listing";

// for typeScript typing
export default class Offer extends Model<InferAttributes<Offer>, InferCreationAttributes<Offer>> {
  declare id: number;
  declare amount: number;
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
