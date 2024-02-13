import { Request, Response, Express } from "express";
import AWS, { AWSError } from "aws-sdk";
import sharp from "sharp";
import S3 from "aws-sdk/clients/s3";
import Listing from "../../database/models/listing";
import Admin from "../../database/models/admin";
import PropertyForRent from "../../database/models/property_for_rent";
import Address from "../../database/models/address";
import { ListingTypeEnum } from "../../../types/enums";
import ListingMedia from "../../database/models/listing_media";
import { InferAttributes, Op, WhereOptions } from "sequelize";
import PropertyForSale from "../../database/models/property_for_sale";
import User from "../../database/models/user";
import ListingQuestion from "../../database/models/listing_question";
import EnquiryConversation from "../../database/models/enquiry_conversation";
import { current } from "@reduxjs/toolkit";

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
    const landlord = await Admin.findOne({ where: { userId: req.session.user?.id } });

    if (landlord) {
      const newListing = await Listing.create({
        title: title,
        description: description,
        listingType: ListingTypeEnum.RENT,
        adminId: landlord!.id,
        isApproved: true
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
        const currentQuestion = questions[i];

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
              label: `${i + 1}`
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
    const landlord = await Admin.findOne({ where: { userId: req.session.user?.id } });

    if (landlord) {
      const newListing = await Listing.create({
        title: title,
        description: description,
        listingType: ListingTypeEnum.SALE,
        adminId: landlord!.id,
        isApproved: true
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
        const currentQuestion = questions[i];

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
              label: `${i + 1}`
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
        { model: Admin, include: [User] },
        { model: ListingQuestion }
      ]
    });

    return res.status(200).json(listing);
  } catch (err) {
    return res.status(500).json({ message: "Internal Server error", err });
  }
};

export const searchRentListingRoute = async (req: Request, res: Response) => {
  // TODO Validation opn query values
  const location = String(req.query.location);
  const page = Number(req.query.page || "0");
  const limit = Number(req.query.limit || "10");
  const minPrice = req.query.minPrice;
  const maxPrice = req.query.maxPrice;
  const minBed = req.query.minBed;
  const maxBed = req.query.maxBed;
  const minBath = req.query.minBath;
  const maxBath = req.query.maxBath;
  const billsIncluded = req.query.bills === "true" ? true : false;
  const furnished = req.query.furnished === "true" ? true : false;

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
        {
          model: PropertyForRent,
          where: {
            [Op.and]: [
              minPrice || maxPrice ? { rentAmount: { [Op.between]: [Number(minPrice || 0), Number(maxPrice || 1000000)] } } : {},
              minBed || maxBed ? { numOfRooms: { [Op.between]: [Number(minBed || 0), Number(maxBed || 1000000)] } } : {},
              minBath || maxBath ? { numOfBathRooms: { [Op.between]: [Number(minBath || 0), Number(maxBath || 1000000)] } } : {},
              req.query.bills !== undefined ? { billsIncluded: billsIncluded } : {},
              req.query.furnished !== undefined ? { isFurnished: furnished } : {}
            ]
          }
        },
        { model: ListingMedia, order: [["id", "ASC"]] },
        { model: Admin, include: [User] }
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
        { model: Admin, include: [User] }
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

export const landlordViewMyListings = async (req: Request, res: Response) => {
  const isAdmin = req.session.user?.accountType === "admin";

  if (!isAdmin) return res.status(401).json({ message: "Unauthorized" });

  try {
    const landlord = await Admin.findOne({ where: { userId: req.session.user?.id } });
    if (!landlord) return res.status(500).json({ message: "Internal Server error" });

    const listingResults = await Listing.findAll({
      where: {
        adminId: landlord.id
      },
      include: [
        { model: Address },
        { model: PropertyForRent },
        { model: PropertyForSale },
        { model: ListingMedia, order: [["id", "ASC"]] },
        { model: Admin, include: [User] },
        { model: EnquiryConversation }
      ],
      order: [["createdAt", "DESC"]]
    });

    return res.status(200).json(listingResults);
  } catch (err) {
    res.status(500).json({ message: "Internal Server error", err });
  }
};

export const updateRentListingById = async (req: Request, res: Response) => {
  const { id } = req.params;
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
  const questions: ListingQuestion[] = JSON.parse(req.body.questions);
  const fullFiles = JSON.parse(req.body.fullFiles);

  try {
    const relatedListing = await Listing.findByPk(id, { include: [Admin, Address, PropertyForRent] });

    if (!relatedListing) return res.status(404).json({ message: "Not found" });
    if (relatedListing?.Admin.userId !== req.session.user?.id) {
      return res.status(401).json({ message: "unauthorized" });
    }
    const relatedAddress = await Address.findByPk(relatedListing?.Address.id);
    const relatedProperty = await PropertyForRent.findByPk(relatedListing?.PropertyForRent.id);

    await relatedListing.update({
      title: title,
      description: description
    });

    await relatedProperty?.update({
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
      rentAmount: rentAmount
    });

    await relatedAddress?.update({
      addressLine1: addressLine1,
      addressLine2: addressLine2,
      settlement: settlement,
      city: city,
      postcode: postcode,
      country: country
    });

    for (let i = 0; i < Number(questions.length); i++) {
      const currentQuestion = questions[i];

      // @ts-ignore
      if (currentQuestion.action === "create") {
        const newQuestion = await ListingQuestion.create({
          text: currentQuestion.text,
          listingId: relatedListing.id
        });
      }
      // @ts-ignore
      if (currentQuestion.action === "delete") {
        await ListingQuestion.destroy({ where: { id: currentQuestion.id } });
      }
    }

    for (let i = 0; i < Number(fullFiles.length); i++) {
      const currentFullFile = fullFiles[i];

      if (currentFullFile.action === "delete") {
        console.log("TODelete");
        //delete from DB
        // also delete from s3
        await s3Bucket.deleteObject({ Bucket: String(process.env.AWS_S3_BUCKET_NAME), Key: currentFullFile.s3BucketKey });
        await ListingMedia.destroy({ where: { id: currentFullFile.id } });
      }

      // size exists due to File Upload extension
      // we can use this to know its a new file that was added
      if (currentFullFile.size) {
        //@ts-ignore
        const matchedFile = files.find(f => f.size === currentFullFile.size && f.originalname === currentFullFile.name);

        const filename = `${new Date().getTime()}_${matchedFile.originalname}`;
        const s3Key = `${req.session.user.id}/${relatedListing.id}/${filename}`;

        // transform to small thumbnail and fix aspect ratio
        const imageBuffer = await sharp(matchedFile.buffer).resize(1080, 720, { fit: "contain" }).toFormat("jpg").toBuffer();

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
            const mediaType = matchedFile.mimetype.split("/")[0];
            const format = matchedFile.mimetype.split("/")[1];
            const mediaURl = val.Location;

            const newMedia = await ListingMedia.create({
              mediaType: mediaType,
              fileFormat: format,
              s3BucketKey: val.Key,
              mediaUrl: mediaURl,
              listingId: relatedListing.id,
              label: `${i + 1}`
            });
          });
      }
    }

    res.status(200).json();
  } catch (err) {
    res.status(500).json({ message: "Internal Server error", err });
  }
};

export const deleteRentListingById = async (req: Request, res: Response) => {
  const listingId = Number(req.params.id);
  const userId = req.session.user!.id;

  try {
    const listing = await Listing.findByPk(listingId, { include: [Admin] });
    if (!listing && listing!.Admin.userId !== userId) {
      return res.status(410).json({ message: "unauthorized" });
    }

    await Listing.destroy({ where: { id: listingId }, cascade: true });

    return res.status(200).json({ message: "Success" });
  } catch (err) {
    return res.status(500).json({ message: "Internal Server error", err });
  }
};

export const getRandomListings = async (req: Request, res: Response) => {
  try {
    const listings = await Listing.findAll({
      limit: 5000,
      include: [
        { model: Address },
        { model: PropertyForRent },
        { model: PropertyForSale },
        { model: ListingMedia, order: [["id", "ASC"]] },
        { model: Admin, include: [User] }
      ]
    });

    const shuffled = listings
      .map(value => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);

    // randomize array results here before return
    return res.status(200).json(shuffled);
  } catch (err) {
    return res.status(500).json({ message: "Internal Server error", err });
  }
};

// export const getAllListings = async (req: Request, res: Response) => {

// }

// CREATE ROUTE FOR LANDLORD CREATING LISTING
