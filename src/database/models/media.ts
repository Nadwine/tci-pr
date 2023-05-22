import { Sequelize, DataTypes, Model, CreationOptional, InferAttributes, InferCreationAttributes } from "sequelize";
import Property from "./property";
import sequelize from "../sequelize-connection";

export default class Media extends Model<InferAttributes<Media>, InferCreationAttributes<Media>> {
  // Only Used for typescript to pick up intellisense and types
  // The Init function below are the actual DB columns
  declare id: CreationOptional<number>;
  declare mediaType: string;
  declare mediaFormat: string;
  declare s3BucketKey: string;
  declare mediaUrl: string;
  declare propertyId: number;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

// allowNull defaults to true if not set
Media.init(
  // @ts-ignore
  {
    // Model attributes are defined here
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    mediaType: {
      type: DataTypes.STRING,
      allowNull: false
    },
    mediaFormat: {
      type: DataTypes.STRING,
      allowNull: false
    },
    s3BucketKey: {
      type: DataTypes.STRING,
      allowNull: false
    },
    mediaUrl: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    // Other model options
    sequelize,
    tableName: "media",
    timestamps: true,
    modelName: "Media"
  }
);
// Media.belongsTo(Project, { foreignKey: 'propertyId' })
Property.hasMany(Media, { foreignKey: "propertyId" });
