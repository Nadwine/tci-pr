import { Request, Response, Express } from "express";
import PropertyForRent from "../../database/models/property_for_rent";
import Listing from "../../database/models/listing";
import ListingLandlord from "../../database/models/listing_landlord";
import Admin from "../../database/models/admin";
import AWS from "aws-sdk";
import S3 from "aws-sdk/clients/s3";
import sharp from "sharp";
import PropertyDocument from "../../database/models/property_document";
import Expense from "../../database/models/expense";
import TenancyRentPayment from "../../database/models/tenancy_rent_payment";

export const createNewExpenseWithDoc = async (req: Request, res: Response) => {
  const { propertyForRentId, documentType, expenseType, date, attachExpense, description, expenseAmount, operation, category, selectedTenancyId } = req.body;
  const files = req.files ?? [];
  const sessionUsr = req.session.user;

  try {
    const isAdmin = req.session.user!.accountType === "admin";
    const isLandlord = req.session.user!.accountType === "landlord";
    const allowed = req.session.user!.accountType === "admin" || req.session.user!.accountType === "landlord";

    if (!allowed) return res.status(401).json({ message: "Unauthorized" });

    const property = await PropertyForRent.findByPk(propertyForRentId, { include: [{ model: Listing, include: [ListingLandlord, Admin] }] });
    // Ensuring Session user has access to View/Modify Property
    if (isAdmin || isLandlord) {
      if (isLandlord && property?.Listing.ListingLandlord?.userId !== req.session!.user!.id) {
        return res.status(401).json({ message: "Unauthorised" });
      }
    } else {
      return res.status(401).json({ message: "Unauthorised" });
    }

    const expense = attachExpense
      ? await Expense.create({
          date: date,
          description: description,
          amount: expenseAmount,
          operation: operation,
          propertyForRentId: propertyForRentId,
          category: category
        })
      : null;

    if (selectedTenancyId) {
      await TenancyRentPayment.create({
        amount: expenseAmount,
        payedAt: date,
        expenseId: expense?.id || 0,
        tenancyId: selectedTenancyId
      });
    }

    if (files[0]) {
      const s3Bucket = new S3({
        s3ForcePathStyle: true,
        region: process.env.AWS_S3_REGION,
        accessKeyId: process.env.AWS_S3_KEY,
        secretAccessKey: process.env.AWS_S3_SECRET,
        endpoint: new AWS.Endpoint(process.env.AWS_S3_ENDPOINT ?? "")
      });
      const isProd = process.env.NODE_ENV === "production" || process.env.NODE_ENV === "test";
      // Uploading files
      const currentFile: Express.Multer.File = files[0];
      const fileFormat = currentFile.mimetype.split("/")[1];
      const filename = `${new Date().getTime()}_${description.replace(/\s+/g, "")}.${fileFormat}`;
      const s3Key = `property_documents/${propertyForRentId}/${filename}`;

      await s3Bucket
        .upload(
          {
            Bucket: String(process.env.AWS_S3_BUCKET_NAME),
            Key: s3Key,
            Body: currentFile.buffer,
            ACL: isProd ? "public-read" : "bucket-owner-full-control"
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

          //create new pic
          const propertyDocument = await PropertyDocument.create({
            mediaType: mediaType,
            mediaFormat: format,
            s3BucketKey: val.Key,
            mediaUrl: mediaURl,
            documentType: documentType || expenseType,
            expenseId: expense?.id,
            propertyForRentId: propertyForRentId,
            label: `${filename}`
          });

          if (attachExpense) {
            expense?.update({
              propertyDocumentId: propertyDocument.id
            });
          }
        });
    }

    return res.json({ message: "success" });
  } catch (err) {
    return res.status(500).json({ message: "internal server error", err });
  }
};
