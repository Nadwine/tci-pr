import { Request } from "express";
import * as yup from "yup";
import _ from "lodash";

export const createListingSchema: yup.AnyObjectSchema = yup.object({
  title: yup.string().required(),
  description: yup.string().required(),
  numOfRooms: yup.number().required(),
  numOfBathRooms: yup.number().required(),
  maxTenant: yup.number().required(),
  sqFt: yup.number().required(),
  billsIncluded: yup.boolean().required(),
  internetIncluded: yup.boolean().required(),
  electricityIncluded: yup.boolean().required(),
  waterIncluded: yup.boolean().required(),
  isFurnished: yup.boolean().required(),
  availability: yup.string().required(),
  addressLine1: yup.string().required(),
  addressLine2: yup.string(),
  settlement: yup.string().optional(),
  city: yup.string().required(),
  postcode: yup.string().required(),
  country: yup.string().required(),
  rentAmount: yup.number().required(),
  listingManager: yup.string().required(),
  tenancyLength: yup.number().required()
});

export const createListingRouteSchema = yup.object({
  body: createListingSchema
});
