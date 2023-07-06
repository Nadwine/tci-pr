import { Request, Response, Express } from "express";
import AWS, { AWSError } from "aws-sdk";
import S3 from "aws-sdk/clients/s3";
import Listing from "../../database/models/listing";
import Landlord from "../../database/models/landlord";
import PropertyForRent from "../../database/models/property_for_rent";
import Address from "../../database/models/address";
import { ListingTypeEnum } from "../../../types/enums";
import ListingMedia from "../../database/models/listing_media";
import { Op } from "sequelize";
import PropertyForSale from "../../database/models/property_for_sale";
import User from "../../database/models/user";

const s3Bucket = new S3({
  s3ForcePathStyle: true,
  region: process.env.AWS_S3_REGION,
  accessKeyId: process.env.AWS_S3_KEY,
  secretAccessKey: process.env.AWS_S3_SECRET,
  endpoint: new AWS.Endpoint(process.env.AWS_S3_ENDPOINT ?? "")
});

export const createRentListingRoute = async (req: Request, res: Response) => {
  const {
    title,
    description,
    numOfRooms,
    numOfBathRooms,
    maxTenant,
    sqFt,
    billsIncluded,
    availability,
    addressLine1,
    addressLine2,
    settlement,
    city,
    postcode,
    country,
    rentAmount
  } = req.body;
  const files = req.files ?? [];

  if (req.session.user?.accountType !== "landlord") return res.status(401).json({ message: "Unauthorized" });
  try {
    const landlord = await Landlord.findOne({ where: { userId: req.session.user?.id } });

    if (landlord) {
      const newListing = await Listing.create({
        title: title,
        description: description,
        listingType: ListingTypeEnum.RENT,
        landlordId: landlord!.id
      });

      await Address.create({
        addressLine1: addressLine1,
        addressLine2: addressLine2,
        settlement: settlement,
        city: city,
        postcode: postcode,
        country: country,
        listingId: newListing!.id
      });

      await PropertyForRent.create({
        numOfRooms: numOfRooms,
        numOfBathRooms: numOfBathRooms,
        maxTenant: maxTenant,
        sqFt: sqFt,
        billsIncluded: billsIncluded,
        availability: availability,
        listingId: newListing.id,
        rentAmount: rentAmount
      });

      // Uploading files
      for (let i = 0; i < Number(files.length); i++) {
        const currentFile: Express.Multer.File = files[i];
        const filename = `${new Date().getTime()}_${currentFile.originalname}`;
        const s3Key = `${req.session.user.id}/${newListing.id}/${filename}`;

        await s3Bucket
          .upload(
            {
              Bucket: String(process.env.AWS_S3_BUCKET_NAME),
              Key: s3Key,
              Body: currentFile.buffer,
              ACL: "bucket-owner-full-control"
            },
            (err, data) => {
              if (data) {
                // successUploadResult.push(data.ETag);
              }
            }
          )
          .on("httpUploadProgress", function (evt) {
            // console.log(evt)
            // Emit Here your events (send this to a socket io id then client can listen in to the socket for upload progress)
            // then destroy the socket when upload is complete
          })
          .promise()
          .then(async (val: S3.ManagedUpload.SendData) => {
            const mediaType = currentFile.mimetype.split("/")[0];
            const format = currentFile.mimetype.split("/")[1];
            const mediaURl = val.Location;

            await ListingMedia.create({
              mediaType: mediaType,
              fileFormat: format,
              s3BucketKey: val.Key,
              mediaUrl: mediaURl,
              listingId: newListing.id,
              label: currentFile.originalname
            });
          });

        // 1 Iteration Done
      }

      return res.status(200).json({ result: "success" });
    }
    return res.status(400).json({ result: "error" });
  } catch (err) {
    return res.status(500).json({ message: "Internal Server error", err });
  }
};

export const searchRentListingRoute = async (req: Request, res: Response) => {
  const location = String(req.query.location);
  const page = Number(req.query.page || "0");
  const resultsPerPage = Number(req.query.resultsPerPage || "10");

  try {
    const listings = await Listing.findAndCountAll({
      offset: resultsPerPage * page,
      limit: resultsPerPage,
      subQuery: false,
      where: {
        listingType: ListingTypeEnum.RENT
      },
      include: [
        {
          model: Address,
          where: {
            [Op.or]: [
              { city: { [Op.iLike]: location } },
              { settlement: { [Op.iLike]: location } },
              { addressLine1: { [Op.iLike]: location } },
              { addressLine2: { [Op.iLike]: location } }
            ]
          }
        },
        { model: PropertyForRent },
        { model: ListingMedia },
        { model: Landlord, include: [User] }
      ],
      order: [["createdAt", "DESC"]]
    });
    return res.status(200).json(listings.rows);
  } catch (err) {
    res.status(500).json({ message: "Internal Server error", err });
  }
};

export const searchSaleListingRoute = async (req: Request, res: Response) => {
  const location = String(req.query.location);
  const page = Number(req.query.page || "1");
  const resultsPerPage = Number(req.query.resultsPerPage || "2");

  try {
    const listings = await Listing.findAll({
      offset: page === 1 ? page - 1 : page * resultsPerPage,
      limit: resultsPerPage,
      subQuery: false,
      where: {
        listingType: ListingTypeEnum.SALE
      },
      include: [
        {
          model: Address,
          where: {
            [Op.or]: [
              { city: { [Op.iLike]: location } },
              { settlement: { [Op.iLike]: location } },
              { addressLine1: { [Op.iLike]: location } },
              { addressLine2: { [Op.iLike]: location } }
            ]
          }
        },
        { model: PropertyForSale },
        { model: ListingMedia }
      ],
      order: [["createdAt", "DESC"]]
    });
    return res.status(200).json(listings);
  } catch (err) {
    res.status(500).json({ message: "Internal Server error", err });
  }
};
