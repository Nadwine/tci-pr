import { DataTypes, Model, CreationOptional, InferAttributes, InferCreationAttributes } from "sequelize";
import sequelize from "../sequelize-connection";
import Tenancy from "./tenancy";
import Expense from "./expense";

export default class TenancyRentPayment extends Model<InferAttributes<TenancyRentPayment>, InferCreationAttributes<TenancyRentPayment>> {
  // Only Used for typescript to pick up intellisense and types
  // The Init function below are the actual DB columns
  declare id: CreationOptional<number>;
  declare amount: number;
  declare payedAt: string;
  declare metadata?: any;
  declare tenancyId: number;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

// allowNull defaults to true if not set
TenancyRentPayment.init(
  // @ts-ignore
  {
    // Model attributes are defined here
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    amount: {
      type: DataTypes.DECIMAL(20, 2),
      allowNull: false
    },
    payedAt: {
      type: DataTypes.STRING,
      allowNull: false
    },
    metadata: {
      type: DataTypes.JSON,
      allowNull: true
    }
  },
  {
    // Other model options
    sequelize,
    tableName: "tenancy_rent_payments",
    timestamps: true,
    modelName: "TenancyRentPayment"
  }
);

Tenancy.hasMany(TenancyRentPayment, { foreignKey: "tenancyId" });
TenancyRentPayment.belongsTo(Tenancy, { foreignKey: "tenancyId" });

TenancyRentPayment.belongsTo(Expense, { foreignKey: "expenseId" });
