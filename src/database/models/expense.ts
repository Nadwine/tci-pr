// expense date, description, landlord.
import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import sequelize from "../sequelize-connection";
import PropertyForRent from "./property_for_rent";
import PropertyDocument from "./property_document";
import TenancyRentPayment from "./tenancy_rent_payment";

export default class Expense extends Model<InferAttributes<Expense>, InferCreationAttributes<Expense>> {
  declare id: CreationOptional<number>;
  declare date: string;
  declare description: string;
  declare amount: number;
  declare category: "rent_payment" | "purchase";
  declare propertyForRentId: number;
  declare propertyDocumentId: CreationOptional<number>;
  declare stripePaymentInfo: any;
  declare operation: "add" | "minus";
  declare TenancyRentPayment: CreationOptional<TenancyRentPayment>;
}

Expense.init(
  // @ts-ignore
  {
    // Model attributes are defined here
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    amount: {
      type: DataTypes.DECIMAL(20, 2),
      allowNull: false
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false
    },
    operation: {
      type: DataTypes.STRING,
      allowNull: false
    },
    stripePaymentInfo: {
      type: DataTypes.JSON,
      allowNull: true
    }
  },
  {
    // Other model options
    sequelize,
    tableName: "expenses",
    timestamps: true,
    modelName: "Expense"
  }
);

PropertyForRent.hasMany(Expense, { foreignKey: "propertyForRentId" });
Expense.belongsTo(PropertyForRent, { foreignKey: "propertyForRentId" });

PropertyDocument.hasOne(Expense, { foreignKey: "propertyDocumentId" });
Expense.belongsTo(PropertyDocument, { foreignKey: "propertyDocumentId" });
