import { Request, Response, Express } from "express";
import Tenancy from "../../database/models/tenancy";
import PropertyForRent from "../../database/models/property_for_rent";
import ListingLandlord from "../../database/models/listing_landlord";
import Listing from "../../database/models/listing";
import Tenant from "../../database/models/tenant";
import TenancyDocument from "../../database/models/tenancy_document";

export const getSessionUserTenancies = async (req: Request, res: Response) => {
  try {
    const tenant = await Tenant.findOne({ where: { userId: req.session.user?.id } });
    if (!tenant) return res.json(null);

    const tenancies = await Tenancy.findAll({
      include: [
        { model: Tenant, where: { id: tenant.id } },
        { model: PropertyForRent, include: [{ model: Listing, include: [{ model: ListingLandlord }] }] },
        { model: TenancyDocument }
      ]
    });
    return res.json(tenancies);
  } catch (err) {
    return res.status(500).json({ message: "Internal server error", err });
  }
};

export const getLandlordTenancies = async (req: Request, res: Response) => {
  try {
    const landlord = await ListingLandlord.findOne({ where: { userId: req.session.user?.id } });
    if (!landlord) return res.json(null);
    const listings = await Listing.findAll({ where: { landlordId: landlord.id }, include: [PropertyForRent] });
    const landLordProperyIds = listings.map(l => l.PropertyForRent.id);

    const tenancies = await Tenancy.findAll({ where: { propertyForRentId: landLordProperyIds }, include: [Tenant] });
    return res.json(tenancies);
  } catch (err) {
    return res.status(500).json({ message: "Internal server error", err });
  }
};

export const getAllTenancies = async (req: Request, res: Response) => {
  if (req.session.user?.accountType !== "admin") {
    return res.status(401).json({ message: "Unauthorised" });
  }
  try {
    const tenancies = await Tenancy.findAll({ include: [PropertyForRent, Tenant] });
    return res.json(tenancies);
  } catch (err) {
    return res.status(500).json({ message: "Internal server error", err });
  }
};

export const getTenancyById = async (req: Request, res: Response) => {
  const tenancyId = req.params.id;
  try {
    const tenancies = await Tenancy.findByPk(tenancyId, { include: [PropertyForRent, Tenant] });
    return res.json(tenancies);
  } catch (err) {
    return res.status(500).json({ message: "Internal server error", err });
  }
};

export const createTenancyRoute = async (req: Request, res: Response) => {
  const { rentalAgreementDate, deposit, isDepositPaid, outstandingRent, isDepositReleased, tenancyStatus, tenantUserId, propertyForRentId, isPaymentTogether } =
    req.body;

  const allowed = req.session.user!.accountType === "admin" || req.session.user!.accountType === "landlord";

  if (!allowed) return res.status(401).json({ message: "Unauthorized" });

  try {
    // const tenancy = await Tenancy.create({
    //   rentalAgreementDate: rentalAgreementDate,
    //   deposit: deposit,
    //   isDepositPaid: isDepositPaid,
    //   outstandingRent: outstandingRent,
    //   isDepositReleased: isDepositReleased,
    //   propertyForRentId: propertyForRentId,
    //   userId: tenantUserId,
    //   tenancyStatus: tenancyStatus,
    //   leadTenantid: 0,
    //   isPaymentTogether: isPaymentTogether
    // });

    return res.status(200).json();
  } catch (err) {
    return res.status(500).json({ message: "Internal Server error 711", err });
  }
};
