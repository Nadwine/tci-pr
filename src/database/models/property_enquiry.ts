import { Sequelize, DataTypes, Model, CreationOptional, InferAttributes, InferCreationAttributes } from "sequelize";
import sequelize from "../sequelize-connection";
import User from "./user";
import Property from "./property";

// for typeScript typing
export default class PropertyEnquiry extends Model<
  InferAttributes<PropertyEnquiry>,
  InferCreationAttributes<PropertyEnquiry>
> {
  // Only Used for typescript to pick up intellisense and types
  // The Init function below are the actual DB columns
  declare id: CreationOptional<number>;
  declare userId: number;
  declare propertyId: number;
  declare message: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

// allowNull defaults to true if not set
// const User = sequelize.define('User', {
PropertyEnquiry.init(
  //@ts-ignore
  {
    // Model attributes are defined here
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  },
  {
    // Other model options go here
    sequelize,
    tableName: "property_enquires",
    timestamps: true,
    modelName: "PropertyEnquiry"
  }
);

PropertyEnquiry.belongsTo(User, { foreignKey: "userId" });
User.hasMany(PropertyEnquiry, { foreignKey: "userId" }); // reverse association
PropertyEnquiry.belongsTo(Property, { foreignKey: "propertyId" });
Property.hasMany(PropertyEnquiry, { foreignKey: "propertyId" }); // reverse association
