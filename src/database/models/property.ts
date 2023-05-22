import { Sequelize, DataTypes, Model, CreationOptional, InferAttributes, InferCreationAttributes } from "sequelize";
import User from "./user";
import sequelize from "../sequelize-connection";
import PropertyEnquiry from "./property_enquiry";
import Landlord from "./landlord";

// for typeScript typing
export default class Property extends Model<InferAttributes<Property>, InferCreationAttributes<Property>> {
  // Only Used for typescript to pick up intellisense and types
  // The Init function below are the actual DB columns
  declare id: CreationOptional<number>;
  declare title: string;
  declare description: string;
  declare userId?: number;
  declare User: CreationOptional<User>;
  declare ProjectTenants: CreationOptional<PropertyEnquiry>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  // property type, rooms, price, advert type (rent, sale)
}

// allowNull defaults to true if not set
Property.init(
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
    }
  },
  {
    // Other model options
    sequelize,
    tableName: "properties",
    timestamps: true,
    modelName: "Property"
  }
);
Property.belongsTo(Landlord, { foreignKey: "landlordId", foreignKeyConstraint: true });
