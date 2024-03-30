// import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional } from "sequelize";
// import sequelize from "../sequelize-connection";
// import Listing from "./listing";

// // for typeScript typing
// export default class LandForSale extends Model<InferAttributes<LandForSale>, InferCreationAttributes<LandForSale>> {
//   // Only Used for typescript to pick up intellisense and types
//   // The Init function below are the actual DB columns
//   declare id: CreationOptional<number>;
//   declare price: CreationOptional<number>;
//   declare createdAt: CreationOptional<Date>;
//   declare updatedAt: CreationOptional<Date>;
// }

// // allowNull defaults to true if not set
// LandForSale.init(
//   // @ts-ignore
//   {
//     // Model attributes are defined here
//     id: {
//       type: DataTypes.INTEGER,
//       autoIncrement: true,
//       primaryKey: true
//     }
//   },
//   {
//     // Other model options go here
//     sequelize,
//     tableName: "land_for_sale",
//     timestamps: true,
//     modelName: "LandForSale"
//   }
// );

// Listing.hasOne(LandForSale, { foreignKey: "listingId", onDelete: "CASCADE" });
