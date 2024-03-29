import { DataTypes, Model, CreationOptional, InferAttributes, InferCreationAttributes } from "sequelize";
import sequelize from "../sequelize-connection";
import Profile from "./profile";

export default class ProfileMedia extends Model<InferAttributes<ProfileMedia>, InferCreationAttributes<ProfileMedia>> {
  // Only Used for typescript to pick up intellisense and types
  // The Init function below are the actual DB columns
  declare id: CreationOptional<number>;
  declare mediaType: string;
  declare fileFormat: string;
  declare s3BucketKey: string;
  declare mediaUrl: string;
  declare label: string;
  declare profileId: number;
  declare Profile: CreationOptional<Profile>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

// allowNull defaults to true if not set
ProfileMedia.init(
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
    fileFormat: {
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
    },
    label: {
      type: DataTypes.STRING,
      allowNull: true
    }
  },
  {
    // Other model options
    sequelize,
    tableName: "profile_media",
    timestamps: true,
    modelName: "ProfileMedia"
  }
);

Profile.hasMany(ProfileMedia, { foreignKey: "profileId" });
ProfileMedia.belongsTo(Profile, { foreignKey: "profileId" });
