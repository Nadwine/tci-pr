import { Request, Response, Express } from "express";
import AWS, { AWSError } from "aws-sdk";
import sharp from "sharp";
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
import ListingQuestion from "../../database/models/listing_question";

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
    internetIncluded,
    electricityIncluded,
    waterIncluded,
    isFurnished,
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
  const questions: string[] = JSON.parse(req.body.questions);

  if (req.session.user?.accountType !== "landlord") return res.status(401).json({ message: "Unauthorized" });

  let createdListingId: number | null = null;
  let createdAddressId: number | null = null;
  let createdPropertyForRentId: number | null = null;
  let createdQuestionIds: number[] = [];
  let createdMediaIds: number[] = [];
  try {
    const landlord = await Landlord.findOne({ where: { userId: req.session.user?.id } });

    if (landlord) {
      const newListing = await Listing.create({
        title: title,
        description: description,
        listingType: ListingTypeEnum.RENT,
        landlordId: landlord!.id
      });
      createdListingId = newListing.id;

      const newAddress = await Address.create({
        addressLine1: addressLine1,
        addressLine2: addressLine2,
        settlement: settlement,
        city: city,
        postcode: postcode,
        country: country,
        listingId: newListing!.id
      });
      createdAddressId = newAddress.id;

      const newPropertyForRent = await PropertyForRent.create({
        numOfRooms: numOfRooms,
        numOfBathRooms: numOfBathRooms,
        maxTenant: maxTenant,
        sqFt: sqFt,
        billsIncluded: billsIncluded,
        internetIncluded: internetIncluded,
        electricityIncluded: electricityIncluded,
        waterIncluded: waterIncluded,
        isFurnished: isFurnished,
        availability: availability,
        listingId: newListing.id,
        rentAmount: rentAmount
      });
      createdPropertyForRentId = newPropertyForRent.id;

      // Creating required questions
      for (let i = 0; i < Number(questions.length); i++) {
        const currentQuestion = questions[0];

        const newQuestion = await ListingQuestion.create({
          text: currentQuestion,
          listingId: newListing.id
        });
        createdQuestionIds.push(newQuestion.id);
      }

      // Uploading files
      for (let i = 0; i < Number(files.length); i++) {
        const currentFile: Express.Multer.File = files[i];
        const filename = `${new Date().getTime()}_${currentFile.originalname}`;
        const s3Key = `${req.session.user.id}/${newListing.id}/${filename}`;

        // transform to small thumbnail and fix aspect ratio
        const imageBuffer = await sharp(currentFile.buffer).resize(1080, 720, { fit: "contain" }).toFormat("jpg").toBuffer();

        await s3Bucket
          .upload(
            {
              Bucket: String(process.env.AWS_S3_BUCKET_NAME),
              Key: s3Key,
              Body: imageBuffer,
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

            const newMedia = await ListingMedia.create({
              mediaType: mediaType,
              fileFormat: format,
              s3BucketKey: val.Key,
              mediaUrl: mediaURl,
              listingId: newListing.id,
              label: currentFile.originalname
            });
            createdMediaIds.push(newMedia.id);
          });

        // 1 Iteration Done
      }

      return res.status(200).json({ result: "success" });
    }
    return res.status(400).json({ result: "error" });
  } catch (err) {
    // on error delete media
    for (let i = 0; i < Number(createdMediaIds.length); i++) {
      const mediaId = createdMediaIds[i];
      await ListingMedia.destroy({ where: { id: mediaId } });
    }
    //on error delete questions
    for (let i = 0; i < Number(createdQuestionIds.length); i++) {
      const questionId = createdQuestionIds[i];
      await ListingQuestion.destroy({ where: { id: questionId } });
    }
    //on error delete property
    if (createdPropertyForRentId) {
      await PropertyForRent.destroy({ where: { id: createdPropertyForRentId } });
    }

    //on error delete address
    if (createdAddressId) {
      await Address.destroy({ where: { id: createdAddressId } });
    }

    //on error delete listing
    if (createdListingId) {
      await Listing.destroy({ where: { id: createdListingId } });
    }

    return res.status(500).json({ message: "Internal Server error", err });
  }
};

export const createSaleListingRoute = async (req: Request, res: Response) => {
  const {
    title,
    description,
    numOfRooms,
    numOfBathRooms,
    sqFt,
    isFurnished,
    availability,
    addressLine1,
    addressLine2,
    settlement,
    city,
    postcode,
    country,
    saleAmount
  } = req.body;
  const files = req.files ?? [];
  const questions: string[] = JSON.parse(req.body.questions);

  if (req.session.user?.accountType !== "landlord") return res.status(401).json({ message: "Unauthorized" });

  let createdListingId: number | null = null;
  let createdAddressId: number | null = null;
  let createdPropertyForSaleId: number | null = null;
  let createdQuestionIds: number[] = [];
  let createdMediaIds: number[] = [];
  try {
    const landlord = await Landlord.findOne({ where: { userId: req.session.user?.id } });

    if (landlord) {
      const newListing = await Listing.create({
        title: title,
        description: description,
        listingType: ListingTypeEnum.SALE,
        landlordId: landlord!.id
      });
      createdListingId = newListing.id;

      const newAddress = await Address.create({
        addressLine1: addressLine1,
        addressLine2: addressLine2,
        settlement: settlement,
        city: city,
        postcode: postcode,
        country: country,
        listingId: newListing!.id
      });
      createdAddressId = newAddress.id;

      const newPropertyForSale = await PropertyForSale.create({
        numOfRooms: numOfRooms,
        numOfBathRooms: numOfBathRooms,
        sqFt: sqFt,
        isFurnished: isFurnished,
        availability: availability,
        listingId: newListing.id,
        saleAmount: saleAmount
      });
      createdPropertyForSaleId = newPropertyForSale.id;

      // Creating required questions
      for (let i = 0; i < Number(questions.length); i++) {
        const currentQuestion = questions[0];

        const newQuestion = await ListingQuestion.create({
          text: currentQuestion,
          listingId: newListing.id
        });
        createdQuestionIds.push(newQuestion.id);
      }

      // Uploading files
      for (let i = 0; i < Number(files.length); i++) {
        const currentFile: Express.Multer.File = files[i];
        const filename = `${new Date().getTime()}_${currentFile.originalname}`;
        const s3Key = `${req.session.user.id}/${newListing.id}/${filename}`;

        // transform to small thumbnail and fix aspect ratio
        const imageBuffer = await sharp(currentFile.buffer).resize(1080, 720, { fit: "contain" }).toFormat("jpg").toBuffer();

        await s3Bucket
          .upload(
            {
              Bucket: String(process.env.AWS_S3_BUCKET_NAME),
              Key: s3Key,
              Body: imageBuffer,
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

            const newMedia = await ListingMedia.create({
              mediaType: mediaType,
              fileFormat: format,
              s3BucketKey: val.Key,
              mediaUrl: mediaURl,
              listingId: newListing.id,
              label: currentFile.originalname
            });
            createdMediaIds.push(newMedia.id);
          });

        // 1 Iteration Done
      }

      return res.status(200).json({ result: "success" });
    }
    return res.status(400).json({ result: "error" });
  } catch (err) {
    // on error delete media
    for (let i = 0; i < Number(createdMediaIds.length); i++) {
      const mediaId = createdMediaIds[i];
      await ListingMedia.destroy({ where: { id: mediaId } });
    }
    //on error delete questions
    for (let i = 0; i < Number(createdQuestionIds.length); i++) {
      const questionId = createdQuestionIds[i];
      await ListingQuestion.destroy({ where: { id: questionId } });
    }
    //on error delete property
    if (createdPropertyForSaleId) {
      await PropertyForSale.destroy({ where: { id: createdPropertyForSaleId } });
    }

    //on error delete address
    if (createdAddressId) {
      await Address.destroy({ where: { id: createdAddressId } });
    }

    //on error delete listing
    if (createdListingId) {
      await Listing.destroy({ where: { id: createdListingId } });
    }

    return res.status(500).json({ message: "Internal Server error", err });
  }
};

export const getRentListingById = async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    const listing = await Listing.findByPk(id, {
      include: [
        { model: Address },
        { model: PropertyForRent },
        { model: ListingMedia, order: [["id", "ASC"]] },
        { model: Landlord, include: [User] },
        { model: ListingQuestion }
      ]
    });

    return res.status(200).json(listing);
  } catch (err) {
    return res.status(500).json({ message: "Internal Server error", err });
  }
};

export const searchRentListingRoute = async (req: Request, res: Response) => {
  const location = String(req.query.location);
  const page = Number(req.query.page || "0");
  const limit = Number(req.query.limit || "10");

  try {
    const offset = page * limit;
    const listingResults = await Listing.findAll({
      offset: offset,
      limit: limit,
      subQuery: true,
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
        { model: ListingMedia, order: [["id", "ASC"]] },
        { model: Landlord, include: [User] }
      ],
      order: [["createdAt", "DESC"]]
    });

    const count = await Listing.count({
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
        }
      ]
    });

    const data = { rows: listingResults, count: count };
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ message: "Internal Server error", err });
  }
};

export const searchSaleListingRoute = async (req: Request, res: Response) => {
  const location = String(req.query.location);
  const page = Number(req.query.page || "0");
  const limit = Number(req.query.limit || "10");

  try {
    const offset = page * limit;
    const listingResults = await Listing.findAll({
      offset: offset,
      limit: limit,
      subQuery: true,
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
        { model: PropertyForRent },
        { model: ListingMedia, order: [["id", "ASC"]] },
        { model: Landlord, include: [User] }
      ],
      order: [["createdAt", "DESC"]]
    });

    const count = await Listing.count({
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
        }
      ]
    });

    const data = { rows: listingResults, count: count };
    return res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: "Internal Server error", err });
  }
};
