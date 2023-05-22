# Development Setup
==================================================
* Require Node v14
* Require Local Postgres v12

* run yarn to install all dependencies

* .env.development variables are stored on git so postgres user details must match

* run yarn createDB to create the database

* run yarn build to create server static files(picture-logos etc) this is needed since server and client run on  the same port

* (only on first setup) npm link serverless to link s3 package locally

* run yarn start  to the run application

NOTE
aws s3 bucket files are uploaded to aws-s3-media folder located on the root of the project. This is hosted on port: 4569

aws ses email are sent to aws-ses folder located on the root of the project. This is hosted on port: 9001

the ./dist folder is the production bundle of the application
