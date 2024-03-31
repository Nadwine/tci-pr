import { Express, Response, Request } from "express";
import AWS, { AWSError } from "aws-sdk";
import S3 from "aws-sdk/clients/s3";
import TenancyDocument from "../../database/models/tenancy_document";
import fs from "fs";
import Tenancy from "../../database/models/tenancy";

export const uploadTenancyAgreement = async (req: Request, res: Response) => {
  const files = req.files ?? [];
  const sessionUsr = req.session.user;
  const tenancyId = req.body.tenancyId;
  const signer = req.body.signer;
  const signing = Boolean(signer);
  const dateTime = req.body.dateTime;
  const name = req.session.user!.email;

  if (files.length === 0) return res.status(400).json({ message: "Bad request, No Files to upload" });

  try {
    const s3Bucket = new S3({
      s3ForcePathStyle: true,
      region: process.env.AWS_S3_REGION,
      accessKeyId: process.env.AWS_S3_KEY,
      secretAccessKey: process.env.AWS_S3_SECRET,
      endpoint: new AWS.Endpoint(process.env.AWS_S3_ENDPOINT ?? "")
    });
    const isProd = process.env.NODE_ENV === "production";

    const existingAgreement = await TenancyDocument.findOne({ where: { documentType: "tenancy-agreement", tenancyId: tenancyId } });
    await s3Bucket.deleteObject({ Bucket: process.env.AWS_S3_BUCKET_NAME, Key: existingAgreement?.s3BucketKey || "" }, (err, data) => {});

    // If enter here means we are trying to upload a fresh copy.
    if (existingAgreement) {
      !signer && (await existingAgreement.destroy());
    }

    // Uploading files
    const currentFile: Express.Multer.File = files[0];
    const filename = `${new Date().getTime()}_${currentFile.originalname}`;
    const s3Key = `tenancy_agreements/${tenancyId}/agreement.pdf`;

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

        if (signing) {
          const meta = { ...existingAgreement?.metadata };
          if (signer === "tenant") {
            meta.tenantsSignData
              ? meta.tenantsSignData?.push({ name: name, dateTime: dateTime })
              : (meta.tenantsSignData = [{ name: name, dateTime: dateTime }]);
          } else {
            // Property Manager is signing
            meta.landlordSignData = { name: name, dateTime: dateTime };
          }

          await existingAgreement?.update({
            //@ts-ignore
            metadata: meta
          });
        }

        if (!signing) {
          await TenancyDocument.create({
            mediaType: mediaType,
            fileFormat: format,
            s3BucketKey: val.Key,
            mediaUrl: mediaURl,
            tenancyId: tenancyId,
            label: `${filename}`,
            documentType: "tenancy-agreement"
          });
        }
      });

    return res.json({ message: "success" });
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error", err });
  }
};

export const getTenancyAgreementFromS3Bucket = async (req: Request, res: Response) => {
  // TODO ensure user can view the image before sending
  if (!req.params.tenancyId) return res.status(400).json({ message: "bad request" });
  const s3Key = `tenancy_agreements/${req.params.tenancyId}/agreement.pdf`;
  // const userId = Number(req.params.userId);
  // const projectId = Number(req.params.projectId);
  // const canView = canUserViewMedia(visibility, projectId, userId, req.session);

  // TODO Visibility
  // if (!canView) {
  //   return res.status(401).json({ message: "unauthorized" });
  // }
  try {
    const s3Bucket = new S3({
      s3ForcePathStyle: true,
      region: process.env.AWS_S3_REGION,
      accessKeyId: process.env.AWS_S3_KEY,
      secretAccessKey: process.env.AWS_S3_SECRET,
      endpoint: new AWS.Endpoint(process.env.AWS_S3_ENDPOINT ?? "")
    });
    const isProd = process.env.NODE_ENV === "production";

    const awsReqParams = { Bucket: String(process.env.AWS_S3_BUCKET_NAME), Key: s3Key };
    const fileStream = s3Bucket.getObject(awsReqParams).createReadStream();
    fileStream.on("error", (err: Error) => {
      return res.status(404).json({ message: "file not found", error: err });
    });

    res.setHeader("Content-Type", "application/pdf");
    await fileStream.pipe(res);
  } catch (err) {
    return res.status(500).send();
  }
};
