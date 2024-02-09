# Development Setup
==================================================
* Require Node v14.18.0

* Require Local Postgres v12

* run: npm install all dependencies

* .env.development variables are stored on git so postgres user details must match

* run: npm run create-db to create the database

* run: npm run build to create server static files(picture-logos etc) this is needed since server and client run on  the same port

* (only on first setup) npm link serverless to link s3 package locally

* run: npm run start  to the run application

NOTE
aws s3 bucket files are uploaded to aws-s3-media folder located on the root of the project. This is hosted on port: 4569

aws ses email are sent to aws-ses folder located on the root of the project. This is hosted on port: 9001

the ./dist folder is the production bundle of the application

# known issues
sharp package might error upon nmp install:  "npm install --unsafe-perm" may work
Also package version and node combo had to be exact node 14.17.6 and sharp 0.29.1

# Stripe
- Test Credit Card Number
 4242 4242 4242 4242
 Expire - any data in future
 Cvv - any 3 digit
