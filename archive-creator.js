const fs = require("fs");
const archiver = require("archiver");

// Increment build number
const envFiles = [".env.development", ".env.test", ".env.production"];
for (let index = 0; index < envFiles.length; index++) {
  const file = envFiles[index];

  var data = fs.readFileSync(file, { encoding: "utf8" });
  var indexLineStartsAt = data.indexOf("APP_BUILD_NUMBER");
  var substring = data.substring(indexLineStartsAt, indexLineStartsAt + 52);
  var buildNumberLineText = substring.split("\n")[0];
  var currentBuildNumber = buildNumberLineText.split("=")[1];
  var newBuildNumber = Number(currentBuildNumber) + 1;
  var formatted = data.replace(buildNumberLineText, `APP_BUILD_NUMBER=${newBuildNumber}`);

  fs.writeFileSync(file, formatted, { encoding: "utf8" });
}

// create a file to stream archive data to.
const output = fs.createWriteStream(__dirname + "/prod-deploy.zip");
const archive = archiver("zip", {
  zlib: { level: 9 } // Sets the compression level.
});

// listen for all archive data to be written
// 'close' event is fired only when a file descriptor is involved
output.on("close", function () {
  console.log(archive.pointer() + " total bytes");
  console.log("archiver has been finalized and the output file descriptor has closed.");
});

// This event is fired when the data source is drained no matter what was the data source.
// It is not part of this library but rather from the NodeJS Stream API.
// @see: https://nodejs.org/api/stream.html#stream_event_end
output.on("end", function () {
  console.log("Data has been drained");
});

// good practice to catch warnings (ie stat failures and other non-blocking errors)
archive.on("warning", function (err) {
  if (err.code === "ENOENT") {
    // log warning
  } else {
    // throw error
    console.log("warning", err);
  }
});

// good practice to catch this error explicitly
archive.on("error", function (err) {
  console.log("Zip create err", err);
});

// pipe archive data to the file
archive.pipe(output);
const packagejson = require("./package.json");
// append files from stream
archive.file("./.env.production");
archive.file("./.env.test");
archive.file("./index.html");
archive.file("./package-lock.json");
archive.file("./package.json");
archive.file("./Procfile");
archive.file("./server.ts");
archive.file("./tsconfig.json");
archive.file("./tsconfig.prod.json");
archive.file("./vite.config.ts");

// archive.append(fs.createReadStream("./src"));
// archive.append(fs.createReadStream("./dist"));
// archive.append(fs.createReadStream("./static"));
// archive.append(fs.createReadStream("./types"));

archive.directory("src/", "src");
archive.directory("dist/", "dist");
archive.directory("static/", "static");
archive.directory("types/", "types");
// finalize the archive (ie we are done appending files but streams have to finish yet)
// 'close', 'end' or 'finish' may be fired right after calling this method so register to them beforehand
archive.finalize();
