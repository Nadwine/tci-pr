import { Request } from "express";
import Joi from "joi";
import _ from "lodash";

export const createListingSchema = Joi.object({
  title: Joi.string().required().messages({
    "string.empty": "Title is required"
  }),
  description: Joi.string().required().messages({
    "string.empty": "Description is required"
  }),
  numOfRooms: Joi.number().required().messages({
    "number.base": "Number of rooms is required"
  }),
  numOfBathRooms: Joi.number().required().messages({
    "number.base": "Number of bathrooms is required"
  }),
  maxTenant: Joi.number().required().messages({
    "number.base": "Maximum number of tenants is required"
  }),
  sqFt: Joi.number()
    .custom((value, helpers) => {
      if (isNaN(value)) {
        return 0;
      }
      return value;
    })
    .allow(null)
    .optional(),
  billsIncluded: Joi.boolean().required().messages({
    "boolean.base": "Bills included is required"
  }),
  internetIncluded: Joi.boolean().required().messages({
    "boolean.base": "Internet included is required"
  }),
  electricityIncluded: Joi.boolean().required().messages({
    "boolean.base": "Electricity included is required"
  }),
  waterIncluded: Joi.boolean().required().messages({
    "boolean.base": "Water included is required"
  }),
  isFurnished: Joi.boolean().required().messages({
    "boolean.base": "Furnished status is required"
  }),
  availability: Joi.string().required().messages({
    "string.empty": "Availability is required"
  }),
  addressLine1: Joi.string().required().messages({
    "string.empty": "Address line 1 is required"
  }),
  addressLine2: Joi.string().optional().allow(""),
  settlement: Joi.string().optional().allow(""),
  city: Joi.string().required().messages({
    "string.empty": "City is required"
  }),
  postcode: Joi.string().required().messages({
    "string.empty": "Postcode is required"
  }),
  country: Joi.string().required().messages({
    "string.empty": "Country is required"
  }),
  rentAmount: Joi.number().required().messages({
    "number.base": "Rent amount is required"
  }),
  listingManager: Joi.string().required().messages({
    "string.empty": "Listing manager is required"
  }),
  tenancyLength: Joi.number().required().messages({
    "number.base": "Tenancy length is required"
  })
});

export const createListingRouteSchema = Joi.object({
  body: createListingSchema
});
