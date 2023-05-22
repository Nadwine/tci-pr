import { Sequelize, DataTypes, Model, CreationOptional, InferAttributes, InferCreationAttributes } from "sequelize";
import Property from "./property";
import User from "./user";
import sequelize from "../sequelize-connection";

// for typeScript typing
export default class PropertyView extends Model<InferAttributes<PropertyView>, InferCreationAttributes<PropertyView>> {
  // Only Used for typescript to pick up intellisense and types
  // The Init function below are the actual DB columns
  declare id: CreationOptional<string>;
  declare ipAddress: string;
  declare visitorId: string;
  declare projectId: number;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

// allowNull defaults to true if not set
PropertyView.init(
  // @ts-ignore
  {
    // Model attributes are defined here
    id: {
      type: DataTypes.UUID,
      // autoIncrement: true, // does not work with UUID
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    ipAddress: {
      type: DataTypes.STRING,
      allowNull: false
    },
    visitorId: {
      type: DataTypes.UUID,
      allowNull: false
    }
  },
  {
    // Other model options
    sequelize,
    tableName: "project_views",
    timestamps: true,
    modelName: "ProjectView"
  }
);

Property.hasMany(PropertyView, { foreignKey: "projectId" });

PropertyView.belongsTo(User, { foreignKey: { name: "userId", allowNull: true } });
