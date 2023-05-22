const kill = require("kill-port");
const webAppPort = 8080;
const emailPort = 9001;
const s3Port = 4569;

// Kill S3 Bucket
kill(s3Port, "tcp")
  .then(() => console.log("Killed S3 bucket port 4569 \n"))
  .catch(() => console.log("No process on port 4569; Skipping..... \n"));

// Kill Email server
kill(emailPort, "tcp")
  .then(() => console.log("Killed Email Server port 9001 \n"))
  .catch(() => console.log("No process on port 9001; Skipping..... \n"));

// Kill App
kill(webAppPort, "tcp")
  .then(() => console.log("Killed Web App port 8080 \n"))
  .catch(() => console.log("No webApp on port 8080; Skipping..... \n"));
