const AWS = require("aws-sdk");

module.exports.webhook = (event, context, callback) => {
  // const S3 = new AWS.S3({
  //   s3ForcePathStyle: true,
  //   accessKeyId: "S3RVER", // This specific key is required when working offline
  //   secretAccessKey: "S3RVER",
  //   endpoint: new AWS.Endpoint("http://localhost:4569"),
  // });
  // S3.putObject({
  //   Bucket: "local-bucket",
  //   Key: "1234",
  //   Body: new Buffer("abcd")
  // }, () => callback(null, "ok"));
};

module.exports.s3hook = (event, context) => {
  event.Records.forEach(e => {
    console.log(`${e?.eventName} - ${e?.s3?.object?.key}`);
  });
};
