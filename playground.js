/*=====================================================*
 *
 *        This file is to test quick little pieces of code
 *        to see how it behaves.
 *
 *=====================================================*/

// Delete your code below when done
const S3 = require("aws-sdk/clients/s3");
const AWS = require("aws-sdk");
const fs = require("fs");

const s3Bucket = new S3({
  s3ForcePathStyle: true,
  region: "us-east-1",
  accessKeyId: "AKIAQ3EGTSNIQPCJM6EY",
  secretAccessKey: "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",
  endpoint: new AWS.Endpoint("tcihomebase-prod-media.s3.us-east-1.amazonaws.com")
});

//  TEST S3 - prod


// s3Bucket.listBuckets((err, data) => {
//   err && console.log("error", err);
//   data && console.log("data", data);
// });
// const file = fs.readFileSync("./static/approve.png");
// s3Bucket
//   .upload(
//     {
//       Bucket: "tcihomebase-prod-media",
//       Key: "s3test.png",
//       Body: file,
//       ACL: "public-read"
//     },
//     (err, data) => {
//       if (data) {
//         // successUploadResult.push(data.ETag);
//         data && console.log(data)
//         err && console.log(data)
//       }
//     }
//   )
//   .promise()
//   .then(async val => {
//     console.log(val);
//   })
//   .catch(err => console.log(err));

// s3Bucket.getObjectAttributes({ Bucket: "tcihomebase-prod-media", Key: "s3test.png", ObjectAttributes: ["ETag","Checksum","StorageClass","ObjectSize"] }, (err, data) => {
//   console.log(err, data)
// })


// TEST SES - prod
const ses = new AWS.SES({
  region: "us-east-1",
  endpoint: "email.us-east-1.amazonaws.com",
  credentials: { accessKeyId: "AKIAQ3EGTSNIQPCJM6EY", secretAccessKey: "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" }
});

ses.sendEmail(
  {
    Destination: { ToAddresses: ["brutchsama14@gmail.com"] },
    Message: {
      Body: {
        Html: { Data: `test` },
        Text: { Data: `test` }
      },
      Subject: {
        Data: "Account Verification"
      }
    },
    Source: "tci.homebase.tc@gmail.com"
  },
  (emailFailedError, data) => {
    if (emailFailedError?.message) {
      console.log("Email Failed To Send Error", emailFailedError.message);
    } else {
      console.log("success", data);
    }
  }
);
