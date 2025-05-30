import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional, CreationAttributes } from "sequelize";
import sequelize from "../sequelize-connection";
import Listing from "./listing";
import Expense from "./expense";
import PropertyDocument from "./property_document";
import Tenancy from "./tenancy";

// for typeScript typing
export default class PropertyForRent extends Model<InferAttributes<PropertyForRent>, InferCreationAttributes<PropertyForRent>> {
  // Only Used for typescript to pick up intellisense and types
  // The Init function below are the actual DB columns
  declare id: CreationOptional<number>;
  declare numOfRooms: number;
  declare numOfBathRooms: number;
  declare maxTenant: number;
  declare sqFt?: number;
  declare billsIncluded: boolean;
  declare internetIncluded: boolean;
  declare electricityIncluded: boolean;
  declare waterIncluded: boolean;
  declare isFurnished: boolean;
  declare rentAmount: number;
  declare availability: string;
  declare listingId: number;
  /**
   * Tenancy Length in Days
   */
  declare tenancyLength: number;
  declare numOfTenants: CreationOptional<number>;
  declare Listing: CreationOptional<Listing>;
  declare Tenancies: CreationOptional<Tenancy[]>;
  declare Expenses: CreationOptional<Expense[]>;
  declare PropertyDocuments: CreationOptional<PropertyDocument[]>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

// Link landlord id

// allowNull defaults to true if not set
PropertyForRent.init(
  // @ts-ignore
  {
    // Model attributes are defined here
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    numOfRooms: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    numOfBathRooms: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    maxTenant: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    sqFt: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    availability: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    billsIncluded: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    internetIncluded: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    electricityIncluded: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    waterIncluded: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    isFurnished: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    rentAmount: {
      type: DataTypes.DECIMAL(20, 2),
      allowNull: false
    },
    tenancyLength: {
      type: DataTypes.STRING,
      allowNull: false
    },
    numOfTenants: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    }
  },
  {
    // Other model options go here
    sequelize,
    tableName: "property_for_rent",
    timestamps: true,
    modelName: "PropertyForRent"
  }
);

Listing.hasOne(PropertyForRent, { foreignKey: "listingId" });
PropertyForRent.belongsTo(Listing, { foreignKey: "listingId" });
