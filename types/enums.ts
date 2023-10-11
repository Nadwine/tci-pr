export enum ReactRoutesEnum {
  LANDINGPAGE = "/",
  LOGIN = "/login",
  REGISTER = "/register",
  REGISTERCONFIRM = "/register-confirm",
  MYPROFILE = "/my-profile",
  ADMIN = "/admin"
}

export type AccountTypeEnum = "landlord" | "admin" | "tenant";

export enum ListingTypeEnum {
  RENT = "rent",
  SALE = "sale"
}
