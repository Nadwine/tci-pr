import { Request, Response, Express } from "express";
import User from "../../database/models/user";
import Profile from "../../database/models/profile";
import ListingLandlord from "../../database/models/listing_landlord";
import { where } from "sequelize";
import Tenant from "../../database/models/tenant";
import AWS, { AWSError } from "aws-sdk";
import sharp from "sharp";
import S3 from "aws-sdk/clients/s3";
import ProfileMedia from "../../database/models/profile_media";

export const getProfileForLoggedInUser = async (req: Request, res: Response) => {
  const sessionUsr = req.session.user;

  try {
    const user = await Profile.findOne({
      where: { userId: sessionUsr!.id },
      include: [{ model: User, include: [ListingLandlord] }, { model: ProfileMedia }]
    });

    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json({ message: "Internal Server error 207", err });
  }
};

export const updateSessionUrsProfile = async (req: Request, res: Response) => {
  const sessionUsr = req.session.user;
  const accountType = sessionUsr?.accountType;
  const { firstName, lastName, phoneNumber, addressLine1, addressLine2, city, settlement } = req.body;
  const postcode = "TKCA 1ZZ";
  const country = "Turks and Caicos Islands";

  try {
    const found = await Profile.findOne({
      where: { userId: sessionUsr!.id },
      include: [{ model: User, include: [ListingLandlord, Tenant] }, { model: ProfileMedia }]
    });
    const newRec =
      found == null
        ? await Profile.create({
            firstName: firstName,
            lastName: lastName,
            phoneNumber: phoneNumber,
            addressLine1: addressLine1,
            addressLine2: addressLine2,
            city: city,
            settlement: settlement,
            postcode: postcode,
            country: country,
            email: sessionUsr!.email,
            userId: sessionUsr!.id
          })
        : null;

    if (found) {
      await found.update({
        firstName: firstName,
        lastName: lastName,
        phoneNumber: phoneNumber,
        addressLine1: addressLine1,
        addressLine2: addressLine2,
        city: city,
        settlement: settlement,
        postcode: postcode,
        country: country
      });

      // keep the landlord private profile in sync with his public profile
      if (accountType === "landlord") {
        const foundLandLord = await ListingLandlord.findOne({ where: { userId: sessionUsr!.id } });
        if (foundLandLord) {
          await ListingLandlord.update(
            {
              firstName: firstName,
              lastName: lastName,
              phoneNumber: phoneNumber,
              homeIsland: city,
              addressString: `${settlement && settlement + ","}${city && city + ","}${postcode && postcode + ","}${country && country}`
            },
            { where: { userId: sessionUsr?.id } }
          );
        } else {
          await ListingLandlord.create({
            firstName: firstName,
            lastName: lastName,
            phoneNumber: phoneNumber,
            homeIsland: city,
            userId: sessionUsr!.id,
            addressString: `${settlement && settlement + ","}${city && city + ","}${postcode && postcode + ","}${country && country}`
          });
        }
      }
    }

    await found?.reload();
    await newRec?.reload();

    //@ts-ignore
    return res.status(200).json(found || newRec);
  } catch (err) {
    return res.status(500).json({ message: "Internal Server error 207", err });
  }
};

export const uploadSessionUserProfilePicture = async (req: Request, res: Response) => {
  const files = req.files ?? [];
  const sessionUsr = req.session.user;

  if (files.length === 0) return res.status(400).json({ message: "Bad request, Please Fill in All Required Data" });

  try {
    const s3Bucket = new S3({
      s3ForcePathStyle: true,
      region: process.env.AWS_S3_REGION,
      accessKeyId: process.env.AWS_S3_KEY,
      secretAccessKey: process.env.AWS_S3_SECRET,
      endpoint: new AWS.Endpoint(process.env.AWS_S3_ENDPOINT ?? "")
    });
    const isProd = process.env.NODE_ENV === "production" || process.env.NODE_ENV === "test";

    const profile = await Profile.findOrCreate({ where: { userId: sessionUsr!.id }, defaults: { userId: sessionUsr!.id } });
    if (!profile) return res.status(404).json("Profile not Found");

    // Uploading files
    const currentFile: Express.Multer.File = files[0];
    const filename = `${new Date().getTime()}_${currentFile.originalname}`;
    const s3Key = `profile_pictures/${req.session.user!.id}/${filename}`;

    // transform to small thumbnail and fix aspect ratio
    const imageBuffer = await sharp(currentFile.buffer).resize(1080, 720, { fit: "contain" }).toFormat("jpg").toBuffer();

    const existing_DB_Media = await ProfileMedia.findOne({ where: { profileId: profile[0].id } });

    if (existing_DB_Media) {
      await s3Bucket
        .deleteObject({ Bucket: process.env.AWS_S3_BUCKET_NAME, Key: existing_DB_Media?.s3BucketKey }, (err, data) => {})
        .promise()
        .catch(err => console.log(err));
      await existing_DB_Media.destroy();
    }

    await s3Bucket
      .upload(
        {
          Bucket: String(process.env.AWS_S3_BUCKET_NAME),
          Key: s3Key,
          Body: imageBuffer,
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
        await ProfileMedia.create({
          mediaType: mediaType,
          fileFormat: format,
          s3BucketKey: val.Key,
          mediaUrl: mediaURl,
          profileId: profile[0].id,
          label: `${filename}`
        });
      });

    return res.json({ message: "success" });
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error", err });
  }
};
