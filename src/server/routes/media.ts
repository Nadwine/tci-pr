import express, { Request, Response } from "express";
import AWS, { AWSError } from "aws-sdk";
import S3 from "aws-sdk/clients/s3";
import fs from "fs";
import path from "path";
import { Express } from "express";
import ListingMedia from "../../database/models/listing_media";
import Listing from "../../database/models/listing";
const router = express.Router();

const s3Bucket = new S3({
  s3ForcePathStyle: true,
  region: process.env.AWS_S3_REGION,
  accessKeyId: process.env.AWS_S3_KEY,
  secretAccessKey: process.env.AWS_S3_SECRET,
  endpoint: new AWS.Endpoint(process.env.AWS_S3_ENDPOINT ?? "")
});

/*==================================================================**
 |
 |              POST          /media/attach
 |
 *===================================================================*/
export const attachMediaToProject = async (req: Request, res: Response) => {
  // TODO ensure user owns project
};

/*==================================================================**
 |
 |              GET          /media/:userId/:projectId/:filename
 |
 *===================================================================*/

// export const getTenancyAgreementFromS3Bucket = async (req: Request, res: Response) => {
//   // TODO ensure user can view the image before sending
//   const { s3Key } = req.body;
//   // const userId = Number(req.params.userId);
//   // const projectId = Number(req.params.projectId);
//   // const canView = canUserViewMedia(visibility, projectId, userId, req.session);

//   // TODO Visibility
//   // if (!canView) {
//   //   return res.status(401).json({ message: "unauthorized" });
//   // }
//   try {
//     const awsReqParams = { Bucket: String(process.env.AWS_S3_BUCKET_NAME), Key: s3Key };
//     const fileStream = s3Bucket.getObject(awsReqParams).createReadStream();
//     fileStream.on("error", (err: Error) => {
//       return res.status(404).json({ message: "file not found", error: err });
//     });

//     await fileStream.pipe(res);
//   } catch (err) {
//     return res.status(500).send();
//   }
// };

export default router;
