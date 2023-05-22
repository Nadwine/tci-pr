import { Sequelize, DataTypes, Model, CreationOptional, InferAttributes, InferCreationAttributes } from "sequelize";
import sequelize from "../sequelize-connection";
import Property from "./property";

// for typeScript typing
export default class PropertyQuestion extends Model<
  InferAttributes<PropertyQuestion>,
  InferCreationAttributes<PropertyQuestion>
> {
  // Only Used for typescript to pick up intellisense and types
  // The Init function below are the actual DB columns
  declare id: CreationOptional<number>;
  declare propertyId: number;
  declare text: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

// allowNull defaults to true if not set
// const User = sequelize.define('User', {
PropertyQuestion.init(
  //@ts-ignore
  {
    // Model attributes are defined here
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    text: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  },
  {
    // Other model options go here
    sequelize,
    tableName: "property_questions",
    timestamps: true,
    modelName: "PropertyEnquiry"
  }
);

PropertyQuestion.belongsTo(Property, { foreignKey: "propertyId" });
Property.hasMany(PropertyQuestion, { foreignKey: "propertyId" }); // reverse association
