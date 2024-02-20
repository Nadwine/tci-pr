import { DataTypes, Model, CreationOptional, InferAttributes, InferCreationAttributes } from "sequelize";
import Listing from "./listing";
import User from "./user";
import sequelize from "../sequelize-connection";

// for typeScript typing
export default class ListingSaved extends Model<InferAttributes<ListingSaved>, InferCreationAttributes<ListingSaved>> {
  // Only Used for typescript to pick up intellisense and types
  // The Init function below are the actual DB columns
  declare id: CreationOptional<string>;
  declare userId: number;
  declare listingId: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

// allowNull defaults to true if not set
ListingSaved.init(
  // @ts-ignore
  {
    // Model attributes are defined here
    id: {
      type: DataTypes.UUID,
      // autoIncrement: true, // does not work with UUID
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    }
  },
  {
    // Other model options
    sequelize,
    tableName: "listing_saves",
    timestamps: true,
    modelName: "ListingSaved"
  }
);

Listing.hasMany(ListingSaved, { foreignKey: "listingId" });

ListingSaved.belongsTo(User, { foreignKey: { name: "userId", allowNull: false } });
