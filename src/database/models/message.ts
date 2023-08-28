import { DataTypes, Model, CreationOptional, InferAttributes, InferCreationAttributes } from "sequelize";
import sequelize from "../sequelize-connection";
import User from "./user";
import EnquiryConversation from "./enquiry_conversation";

// for typeScript typing
export default class Message extends Model<InferAttributes<Message>, InferCreationAttributes<Message>> {
  // Only Used for typescript to pick up intellisense and types
  // The Init function below are the actual DB columns
  declare id: CreationOptional<number>;
  declare userId: number;
  declare enquiryConversationId: number;
  declare messageText: string;
  declare messageType: string;
  declare seenAt: Date;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

// allowNull defaults to true if not set
// const User = sequelize.define('User', {
Message.init(
  //@ts-ignore
  {
    // Model attributes are defined here
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    messageText: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    messageType: {
      // image, text, video, httpLink ETC
      type: DataTypes.STRING,
      allowNull: false
    },
    seenAt: {
      type: DataTypes.DATE,
      allowNull: false
    }
  },
  {
    // Other model options go here
    sequelize,
    tableName: "messages",
    timestamps: true,
    modelName: "Message"
  }
);

Message.belongsTo(User, { foreignKey: "userId" });
User.hasMany(Message, { foreignKey: "userId" }); // reverse association
Message.belongsTo(EnquiryConversation, { foreignKey: "enquiryConversationId" });
EnquiryConversation.hasMany(Message, { foreignKey: "enquiryConversationId" }); // reverse association
