import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import sequelize from "../sequelize-connection";

export default class Feedback extends Model<InferAttributes<Feedback>, InferCreationAttributes<Feedback>> {
  declare id: CreationOptional<number>;
  declare contentSatisfication: string;
  declare recommendation: string;
  declare additionalFeedback: string;
}

Feedback.init(
  // @ts-ignore
  {
    // Model attributes are defined here
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    contentSatisfication: {
      type: DataTypes.STRING,
      allowNull: false
    },
    recommendation: {
      type: DataTypes.STRING,
      allowNull: false
    },
    additionalFeedback: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  },
  {
    // Other model options
    sequelize,
    tableName: "feedback",
    timestamps: true,
    modelName: "Feedback"
  }
);
