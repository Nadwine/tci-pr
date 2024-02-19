"use strict";

const Sequelize = require("sequelize");

/**
 * THIS IS JUST A GUIDE !!!!
 * Actions summary:
 *
 * createTable "feedback", deps: []
 * createTable "users", deps: []
 * createTable "listing_landlords", deps: [users]
 * createTable "admin", deps: [users]
 * createTable "addresses", deps: [listings]
 * createTable "property_for_rent", deps: [listings]
 * createTable "enquiry_conversation", deps: [users, listings]
 * createTable "land_for_sale", deps: [listings]
 * createTable "listings", deps: [admin, listing_landlords]
 * createTable "listing_media", deps: [listings]
 * createTable "listing_questions", deps: [listings]
 * createTable "listing_saves", deps: [listings, users]
 * createTable "listing_views", deps: [listings, users]
 * createTable "messages", deps: [users, enquiry_conversation]
 * createTable "offers", deps: [users, listings]
 * createTable "profiles", deps: [users]
 * createTable "profile_media", deps: [profiles]
 * createTable "expenses", deps: [property_for_rent]
 * createTable "property_documents", deps: [property_for_rent]
 * createTable "property_for_sale", deps: [listings]
 * createTable "property_tenants", deps: [property_for_rent, users]
 *
 **/

const info = {
  revision: 1,
  name: "first-init-migration",
  created: "2024-02-19T22:25:29.145Z",
  comment: ""
};

const migrationCommands = [
  {
    fn: "createTable",
    params: [
      "SequelizeMigrationsMeta",
      {
        revision: {
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        name: {
          allowNull: false,
          type: Sequelize.STRING
        },
        state: {
          allowNull: false,
          type: Sequelize.JSON
        }
      },
      {}
    ]
  },
  {
    fn: "bulkDelete",
    params: [
      "SequelizeMigrationsMeta",
      [
        {
          revision: info.revision
        }
      ],
      {}
    ]
  },
  {
    fn: "bulkInsert",
    params: [
      "SequelizeMigrationsMeta",
      [
        {
          revision: info.revision,
          name: info.name,
          state:
            '{"revision":1,"tables":{"addresses":{"tableName":"addresses","schema":{"id":{"seqType":"Sequelize.INTEGER","primaryKey":true,"autoIncrement":true},"addressLine1":{"seqType":"Sequelize.STRING","allowNull":false},"addressLine2":{"seqType":"Sequelize.STRING","allowNull":true},"city":{"seqType":"Sequelize.STRING","allowNull":false},"settlement":{"seqType":"Sequelize.STRING","allowNull":false},"postcode":{"seqType":"Sequelize.STRING","allowNull":false},"country":{"seqType":"Sequelize.STRING","allowNull":false},"createdAt":{"seqType":"Sequelize.DATE","allowNull":false},"updatedAt":{"seqType":"Sequelize.DATE","allowNull":false},"listingId":{"seqType":"Sequelize.INTEGER","allowNull":true,"references":{"model":"listings","key":"id"},"onUpdate":"CASCADE","onDelete":"CASCADE"}},"indexes":{}},"admin":{"tableName":"admin","schema":{"id":{"seqType":"Sequelize.INTEGER","primaryKey":true,"autoIncrement":true},"verified":{"seqType":"Sequelize.BOOLEAN"},"phone":{"seqType":"Sequelize.STRING","allowNull":true},"createdAt":{"seqType":"Sequelize.DATE","allowNull":false},"updatedAt":{"seqType":"Sequelize.DATE","allowNull":false},"userId":{"seqType":"Sequelize.INTEGER","allowNull":true,"references":{"model":"users","key":"id"},"onUpdate":"CASCADE","onDelete":"SET NULL"}},"indexes":{}},"enquiry_conversation":{"tableName":"enquiry_conversation","schema":{"id":{"seqType":"Sequelize.INTEGER","primaryKey":true,"autoIncrement":true},"intro_message":{"seqType":"Sequelize.TEXT","allowNull":false},"createdAt":{"seqType":"Sequelize.DATE","allowNull":false},"updatedAt":{"seqType":"Sequelize.DATE","allowNull":false},"userId":{"seqType":"Sequelize.INTEGER","allowNull":true,"references":{"model":"users","key":"id"},"onUpdate":"CASCADE","onDelete":"SET NULL"},"listingId":{"seqType":"Sequelize.INTEGER","allowNull":true,"references":{"model":"listings","key":"id"},"onUpdate":"CASCADE","onDelete":"CASCADE"}},"indexes":{}},"expenses":{"tableName":"expenses","schema":{"id":{"seqType":"Sequelize.INTEGER","primaryKey":true,"autoIncrement":true},"date":{"seqType":"Sequelize.DATE","allowNull":false},"description":{"seqType":"Sequelize.STRING","allowNull":false},"amount":{"seqType":"Sequelize.DECIMAL(20,2)","allowNull":false},"stripePaymentInfo":{"seqType":"Sequelize.JSON","allowNull":true},"createdAt":{"seqType":"Sequelize.DATE","allowNull":false},"updatedAt":{"seqType":"Sequelize.DATE","allowNull":false},"propertyForRentId":{"seqType":"Sequelize.INTEGER","allowNull":true,"references":{"model":"property_for_rent","key":"id"},"onUpdate":"CASCADE","onDelete":"SET NULL"}},"indexes":{}},"feedback":{"tableName":"feedback","schema":{"id":{"seqType":"Sequelize.INTEGER","primaryKey":true,"autoIncrement":true},"contentSatisfication":{"seqType":"Sequelize.STRING","allowNull":false},"recommendation":{"seqType":"Sequelize.STRING","allowNull":false},"additionalFeedback":{"seqType":"Sequelize.TEXT","allowNull":false},"createdAt":{"seqType":"Sequelize.DATE","allowNull":false},"updatedAt":{"seqType":"Sequelize.DATE","allowNull":false}},"indexes":{}},"land_for_sale":{"tableName":"land_for_sale","schema":{"id":{"seqType":"Sequelize.INTEGER","primaryKey":true,"autoIncrement":true},"createdAt":{"seqType":"Sequelize.DATE","allowNull":false},"updatedAt":{"seqType":"Sequelize.DATE","allowNull":false},"listingId":{"seqType":"Sequelize.INTEGER","allowNull":true,"references":{"model":"listings","key":"id"},"onUpdate":"CASCADE","onDelete":"CASCADE"}},"indexes":{}},"listings":{"tableName":"listings","schema":{"id":{"seqType":"Sequelize.INTEGER","primaryKey":true,"autoIncrement":true},"title":{"seqType":"Sequelize.STRING","allowNull":false},"description":{"seqType":"Sequelize.TEXT","allowNull":false},"listingType":{"seqType":"Sequelize.STRING","allowNull":false},"listingManager":{"seqType":"Sequelize.STRING","allowNull":false},"listingStatus":{"seqType":"Sequelize.STRING","allowNull":false},"isApproved":{"seqType":"Sequelize.BOOLEAN","allowNull":false},"stripePaymentLink":{"seqType":"Sequelize.JSON","allowNull":true},"createdAt":{"seqType":"Sequelize.DATE","allowNull":false},"updatedAt":{"seqType":"Sequelize.DATE","allowNull":false},"adminId":{"seqType":"Sequelize.INTEGER","allowNull":true,"references":{"model":"admin","key":"id"},"onUpdate":"CASCADE","onDelete":"SET NULL"},"landlordId":{"seqType":"Sequelize.INTEGER","allowNull":true,"references":{"model":"listing_landlords","key":"id"},"onUpdate":"CASCADE","onDelete":"SET NULL"}},"indexes":{}},"listing_landlords":{"tableName":"listing_landlords","schema":{"id":{"seqType":"Sequelize.INTEGER","primaryKey":true,"autoIncrement":true},"firstName":{"seqType":"Sequelize.STRING","allowNull":true},"lastName":{"seqType":"Sequelize.STRING","allowNull":true},"phoneNumber":{"seqType":"Sequelize.STRING","allowNull":true},"homeIsland":{"seqType":"Sequelize.STRING","allowNull":true},"address":{"seqType":"Sequelize.STRING","allowNull":true},"cardDetails":{"seqType":"Sequelize.JSON","allowNull":true},"stripeConnectId":{"seqType":"Sequelize.STRING","allowNull":true},"createdAt":{"seqType":"Sequelize.DATE","allowNull":false},"updatedAt":{"seqType":"Sequelize.DATE","allowNull":false},"userId":{"seqType":"Sequelize.INTEGER","allowNull":false,"references":{"model":"users","key":"id"},"onUpdate":"CASCADE","onDelete":"NO ACTION"}},"indexes":{}},"listing_media":{"tableName":"listing_media","schema":{"id":{"seqType":"Sequelize.INTEGER","primaryKey":true,"autoIncrement":true},"mediaType":{"seqType":"Sequelize.STRING","allowNull":false},"fileFormat":{"seqType":"Sequelize.STRING","allowNull":false},"s3BucketKey":{"seqType":"Sequelize.STRING","allowNull":false},"mediaUrl":{"seqType":"Sequelize.TEXT","allowNull":false},"label":{"seqType":"Sequelize.STRING","allowNull":true},"createdAt":{"seqType":"Sequelize.DATE","allowNull":false},"updatedAt":{"seqType":"Sequelize.DATE","allowNull":false},"listingId":{"seqType":"Sequelize.INTEGER","allowNull":true,"references":{"model":"listings","key":"id"},"onUpdate":"CASCADE","onDelete":"SET NULL"}},"indexes":{}},"listing_questions":{"tableName":"listing_questions","schema":{"id":{"seqType":"Sequelize.INTEGER","primaryKey":true,"autoIncrement":true},"text":{"seqType":"Sequelize.TEXT","allowNull":false},"createdAt":{"seqType":"Sequelize.DATE","allowNull":false},"updatedAt":{"seqType":"Sequelize.DATE","allowNull":false},"listingId":{"seqType":"Sequelize.INTEGER","allowNull":true,"references":{"model":"listings","key":"id"},"onUpdate":"CASCADE","onDelete":"SET NULL"}},"indexes":{}},"listing_saves":{"tableName":"listing_saves","schema":{"id":{"seqType":"Sequelize.UUID","primaryKey":true},"ipAddress":{"seqType":"Sequelize.STRING","allowNull":false},"visitorId":{"seqType":"Sequelize.UUID","allowNull":false},"createdAt":{"seqType":"Sequelize.DATE","allowNull":false},"updatedAt":{"seqType":"Sequelize.DATE","allowNull":false},"listingId":{"seqType":"Sequelize.INTEGER","allowNull":true,"references":{"model":"listings","key":"id"},"onUpdate":"CASCADE","onDelete":"SET NULL"},"userId":{"seqType":"Sequelize.INTEGER","allowNull":false,"references":{"model":"users","key":"id"},"onUpdate":"CASCADE","onDelete":"NO ACTION"}},"indexes":{}},"listing_views":{"tableName":"listing_views","schema":{"id":{"seqType":"Sequelize.UUID","primaryKey":true},"ipAddress":{"seqType":"Sequelize.STRING","allowNull":false},"visitorId":{"seqType":"Sequelize.UUID","allowNull":false},"createdAt":{"seqType":"Sequelize.DATE","allowNull":false},"updatedAt":{"seqType":"Sequelize.DATE","allowNull":false},"listingId":{"seqType":"Sequelize.INTEGER","allowNull":true,"references":{"model":"listings","key":"id"},"onUpdate":"CASCADE","onDelete":"SET NULL"},"userId":{"seqType":"Sequelize.INTEGER","allowNull":true,"references":{"model":"users","key":"id"},"onUpdate":"CASCADE","onDelete":"SET NULL"}},"indexes":{}},"messages":{"tableName":"messages","schema":{"id":{"seqType":"Sequelize.INTEGER","primaryKey":true,"autoIncrement":true},"messageText":{"seqType":"Sequelize.TEXT","allowNull":false},"messageType":{"seqType":"Sequelize.STRING","allowNull":false},"seenAt":{"seqType":"Sequelize.DATE","allowNull":true},"createdAt":{"seqType":"Sequelize.DATE","allowNull":false},"updatedAt":{"seqType":"Sequelize.DATE","allowNull":false},"userId":{"seqType":"Sequelize.INTEGER","allowNull":true,"references":{"model":"users","key":"id"},"onUpdate":"CASCADE","onDelete":"SET NULL"},"enquiryConversationId":{"seqType":"Sequelize.INTEGER","allowNull":true,"references":{"model":"enquiry_conversation","key":"id"},"onUpdate":"CASCADE","onDelete":"CASCADE"}},"indexes":{}},"offers":{"tableName":"offers","schema":{"id":{"seqType":"Sequelize.INTEGER","primaryKey":true,"autoIncrement":true},"createdAt":{"seqType":"Sequelize.DATE","allowNull":false},"updatedAt":{"seqType":"Sequelize.DATE","allowNull":false},"userId":{"seqType":"Sequelize.INTEGER","allowNull":true,"references":{"model":"users","key":"id"},"onUpdate":"CASCADE","onDelete":"SET NULL"},"listingId":{"seqType":"Sequelize.INTEGER","allowNull":true,"references":{"model":"listings","key":"id"},"onUpdate":"CASCADE","onDelete":"SET NULL"}},"indexes":{}},"profiles":{"tableName":"profiles","schema":{"id":{"seqType":"Sequelize.INTEGER","primaryKey":true,"autoIncrement":true},"firstName":{"seqType":"Sequelize.STRING","allowNull":true},"lastName":{"seqType":"Sequelize.STRING","allowNull":true},"email":{"seqType":"Sequelize.STRING","allowNull":true},"phoneNumber":{"seqType":"Sequelize.STRING","allowNull":true},"addressLine1":{"seqType":"Sequelize.STRING","allowNull":true},"addressLine2":{"seqType":"Sequelize.STRING","allowNull":true},"city":{"seqType":"Sequelize.STRING","allowNull":true},"settlement":{"seqType":"Sequelize.STRING","allowNull":true},"postcode":{"seqType":"Sequelize.STRING","allowNull":true},"country":{"seqType":"Sequelize.STRING","allowNull":true},"createdAt":{"seqType":"Sequelize.DATE","allowNull":false},"updatedAt":{"seqType":"Sequelize.DATE","allowNull":false},"userId":{"seqType":"Sequelize.INTEGER","allowNull":true,"references":{"model":"users","key":"id"},"onUpdate":"CASCADE","onDelete":"SET NULL"}},"indexes":{}},"profile_media":{"tableName":"profile_media","schema":{"id":{"seqType":"Sequelize.INTEGER","primaryKey":true,"autoIncrement":true},"mediaType":{"seqType":"Sequelize.STRING","allowNull":false},"mediaFormat":{"seqType":"Sequelize.STRING","allowNull":false},"s3BucketKey":{"seqType":"Sequelize.STRING","allowNull":false},"mediaUrl":{"seqType":"Sequelize.STRING","allowNull":false},"label":{"seqType":"Sequelize.STRING","allowNull":true},"createdAt":{"seqType":"Sequelize.DATE","allowNull":false},"updatedAt":{"seqType":"Sequelize.DATE","allowNull":false},"profileId":{"seqType":"Sequelize.INTEGER","allowNull":true,"references":{"model":"profiles","key":"id"},"onUpdate":"CASCADE","onDelete":"SET NULL"}},"indexes":{}},"property_documents":{"tableName":"property_documents","schema":{"id":{"seqType":"Sequelize.INTEGER","primaryKey":true,"autoIncrement":true},"mediaType":{"seqType":"Sequelize.STRING","allowNull":false},"mediaFormat":{"seqType":"Sequelize.STRING","allowNull":false},"s3BucketKey":{"seqType":"Sequelize.STRING","allowNull":false},"mediaUrl":{"seqType":"Sequelize.STRING","allowNull":false},"label":{"seqType":"Sequelize.STRING","allowNull":true},"createdAt":{"seqType":"Sequelize.DATE","allowNull":false},"updatedAt":{"seqType":"Sequelize.DATE","allowNull":false},"propertyForRentId":{"seqType":"Sequelize.INTEGER","allowNull":true,"references":{"model":"property_for_rent","key":"id"},"onUpdate":"CASCADE","onDelete":"SET NULL"}},"indexes":{}},"property_for_rent":{"tableName":"property_for_rent","schema":{"id":{"seqType":"Sequelize.INTEGER","primaryKey":true,"autoIncrement":true},"numOfRooms":{"seqType":"Sequelize.INTEGER","allowNull":false},"numOfBathRooms":{"seqType":"Sequelize.INTEGER","allowNull":false},"maxTenant":{"seqType":"Sequelize.INTEGER","allowNull":false},"availability":{"seqType":"Sequelize.DATEONLY","allowNull":false},"billsIncluded":{"seqType":"Sequelize.BOOLEAN","allowNull":false},"internetIncluded":{"seqType":"Sequelize.BOOLEAN","allowNull":false},"electricityIncluded":{"seqType":"Sequelize.BOOLEAN","allowNull":false},"waterIncluded":{"seqType":"Sequelize.BOOLEAN","allowNull":false},"isFurnished":{"seqType":"Sequelize.BOOLEAN","allowNull":false},"rentAmount":{"seqType":"Sequelize.DECIMAL(20,2)","allowNull":false},"tenancyLength":{"seqType":"Sequelize.STRING","allowNull":false},"createdAt":{"seqType":"Sequelize.DATE","allowNull":false},"updatedAt":{"seqType":"Sequelize.DATE","allowNull":false},"listingId":{"seqType":"Sequelize.INTEGER","allowNull":true,"references":{"model":"listings","key":"id"},"onUpdate":"CASCADE","onDelete":"CASCADE"}},"indexes":{}},"property_for_sale":{"tableName":"property_for_sale","schema":{"id":{"seqType":"Sequelize.INTEGER","primaryKey":true,"autoIncrement":true},"sqFt":{"seqType":"Sequelize.DECIMAL","allowNull":false},"availability":{"seqType":"Sequelize.DATEONLY","allowNull":false},"numOfRooms":{"seqType":"Sequelize.INTEGER","allowNull":false},"numOfBathRooms":{"seqType":"Sequelize.INTEGER","allowNull":false},"isFurnished":{"seqType":"Sequelize.BOOLEAN","allowNull":false},"saleAmount":{"seqType":"Sequelize.INTEGER","allowNull":false},"createdAt":{"seqType":"Sequelize.DATE","allowNull":false},"updatedAt":{"seqType":"Sequelize.DATE","allowNull":false},"listingId":{"seqType":"Sequelize.INTEGER","allowNull":true,"references":{"model":"listings","key":"id"},"onUpdate":"CASCADE","onDelete":"CASCADE"}},"indexes":{}},"property_tenants":{"tableName":"property_tenants","schema":{"id":{"seqType":"Sequelize.INTEGER","primaryKey":true,"autoIncrement":true},"rentalAgreementDate":{"seqType":"Sequelize.DATE","allowNull":true},"deposit":{"seqType":"Sequelize.DECIMAL(20,2)","allowNull":true},"isDepositPaid":{"seqType":"Sequelize.BOOLEAN","allowNull":true},"outstandingRent":{"seqType":"Sequelize.DECIMAL(20,2)","allowNull":true},"isDepositReleased":{"seqType":"Sequelize.BOOLEAN","allowNull":true},"createdAt":{"seqType":"Sequelize.DATE","allowNull":false},"updatedAt":{"seqType":"Sequelize.DATE","allowNull":false},"propertyForRentId":{"seqType":"Sequelize.INTEGER","allowNull":true,"references":{"model":"property_for_rent","key":"id"},"onUpdate":"CASCADE","onDelete":"SET NULL"},"userId":{"seqType":"Sequelize.INTEGER","allowNull":false,"references":{"model":"users","key":"id"},"onUpdate":"CASCADE","onDelete":"NO ACTION"}},"indexes":{}},"users":{"tableName":"users","schema":{"id":{"seqType":"Sequelize.INTEGER","primaryKey":true,"autoIncrement":true},"username":{"seqType":"Sequelize.STRING","allowNull":true},"email":{"seqType":"Sequelize.STRING","allowNull":false},"company":{"seqType":"Sequelize.STRING","allowNull":true},"password":{"seqType":"Sequelize.STRING","allowNull":false},"verified":{"seqType":"Sequelize.BOOLEAN"},"accountType":{"seqType":"Sequelize.STRING"},"createdAt":{"seqType":"Sequelize.DATE","allowNull":false},"updatedAt":{"seqType":"Sequelize.DATE","allowNull":false}},"indexes":{}}}}'
        }
      ],
      {}
    ]
  },

  {
    fn: "createTable",
    params: [
      "feedback",
      {
        id: {
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        contentSatisfication: {
          allowNull: false,
          type: Sequelize.STRING
        },
        recommendation: {
          allowNull: false,
          type: Sequelize.STRING
        },
        additionalFeedback: {
          allowNull: false,
          type: Sequelize.TEXT
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE
        }
      },
      {}
    ]
  },

  {
    fn: "createTable",
    params: [
      "users",
      {
        id: {
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        username: {
          allowNull: true,
          type: Sequelize.STRING
        },
        email: {
          allowNull: false,
          type: Sequelize.STRING
        },
        company: {
          allowNull: true,
          type: Sequelize.STRING
        },
        password: {
          allowNull: false,
          type: Sequelize.STRING
        },
        verified: {
          type: Sequelize.BOOLEAN
        },
        accountType: {
          type: Sequelize.STRING
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE
        }
      },
      {}
    ]
  },

  {
    fn: "createTable",
    params: [
      "listing_landlords",
      {
        id: {
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        firstName: {
          allowNull: true,
          type: Sequelize.STRING
        },
        lastName: {
          allowNull: true,
          type: Sequelize.STRING
        },
        phoneNumber: {
          allowNull: true,
          type: Sequelize.STRING
        },
        homeIsland: {
          allowNull: true,
          type: Sequelize.STRING
        },
        address: {
          allowNull: true,
          type: Sequelize.STRING
        },
        cardDetails: {
          allowNull: true,
          type: Sequelize.JSON
        },
        stripeConnectId: {
          allowNull: true,
          type: Sequelize.STRING
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE
        },
        userId: {
          onDelete: "NO ACTION",
          onUpdate: "CASCADE",
          references: {
            model: "users",
            key: "id"
          },
          allowNull: false,
          type: Sequelize.INTEGER
        }
      },
      {}
    ]
  },

  {
    fn: "createTable",
    params: [
      "admin",
      {
        id: {
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        verified: {
          type: Sequelize.BOOLEAN
        },
        phone: {
          allowNull: true,
          type: Sequelize.STRING
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE
        },
        userId: {
          onDelete: "SET NULL",
          onUpdate: "CASCADE",
          references: {
            model: "users",
            key: "id"
          },
          allowNull: true,
          type: Sequelize.INTEGER
        }
      },
      {}
    ]
  },

  {
    fn: "createTable",
    params: [
      "addresses",
      {
        id: {
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        addressLine1: {
          allowNull: false,
          type: Sequelize.STRING
        },
        addressLine2: {
          allowNull: true,
          type: Sequelize.STRING
        },
        city: {
          allowNull: false,
          type: Sequelize.STRING
        },
        settlement: {
          allowNull: false,
          type: Sequelize.STRING
        },
        postcode: {
          allowNull: false,
          type: Sequelize.STRING
        },
        country: {
          allowNull: false,
          type: Sequelize.STRING
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE
        },
        listingId: {
          onDelete: "CASCADE",
          onUpdate: "CASCADE",
          references: {
            model: "listings",
            key: "id"
          },
          allowNull: true,
          type: Sequelize.INTEGER
        }
      },
      {}
    ]
  },

  {
    fn: "createTable",
    params: [
      "property_for_rent",
      {
        id: {
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        numOfRooms: {
          allowNull: false,
          type: Sequelize.INTEGER
        },
        numOfBathRooms: {
          allowNull: false,
          type: Sequelize.INTEGER
        },
        maxTenant: {
          allowNull: false,
          type: Sequelize.INTEGER
        },
        availability: {
          allowNull: false,
          type: Sequelize.DATEONLY
        },
        billsIncluded: {
          allowNull: false,
          type: Sequelize.BOOLEAN
        },
        internetIncluded: {
          allowNull: false,
          type: Sequelize.BOOLEAN
        },
        electricityIncluded: {
          allowNull: false,
          type: Sequelize.BOOLEAN
        },
        waterIncluded: {
          allowNull: false,
          type: Sequelize.BOOLEAN
        },
        isFurnished: {
          allowNull: false,
          type: Sequelize.BOOLEAN
        },
        rentAmount: {
          allowNull: false,
          type: Sequelize.DECIMAL(20, 2)
        },
        tenancyLength: {
          allowNull: false,
          type: Sequelize.STRING
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE
        },
        listingId: {
          onDelete: "CASCADE",
          onUpdate: "CASCADE",
          references: {
            model: "listings",
            key: "id"
          },
          allowNull: true,
          type: Sequelize.INTEGER
        }
      },
      {}
    ]
  },

  {
    fn: "createTable",
    params: [
      "enquiry_conversation",
      {
        id: {
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        intro_message: {
          allowNull: false,
          type: Sequelize.TEXT
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE
        },
        userId: {
          onDelete: "SET NULL",
          onUpdate: "CASCADE",
          references: {
            model: "users",
            key: "id"
          },
          allowNull: true,
          type: Sequelize.INTEGER
        },
        listingId: {
          onDelete: "CASCADE",
          onUpdate: "CASCADE",
          references: {
            model: "listings",
            key: "id"
          },
          allowNull: true,
          type: Sequelize.INTEGER
        }
      },
      {}
    ]
  },

  {
    fn: "createTable",
    params: [
      "land_for_sale",
      {
        id: {
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE
        },
        listingId: {
          onDelete: "CASCADE",
          onUpdate: "CASCADE",
          references: {
            model: "listings",
            key: "id"
          },
          allowNull: true,
          type: Sequelize.INTEGER
        }
      },
      {}
    ]
  },

  {
    fn: "createTable",
    params: [
      "listings",
      {
        id: {
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        title: {
          allowNull: false,
          type: Sequelize.STRING
        },
        description: {
          allowNull: false,
          type: Sequelize.TEXT
        },
        listingType: {
          allowNull: false,
          type: Sequelize.STRING
        },
        listingManager: {
          allowNull: false,
          type: Sequelize.STRING
        },
        listingStatus: {
          allowNull: false,
          type: Sequelize.STRING
        },
        isApproved: {
          allowNull: false,
          type: Sequelize.BOOLEAN
        },
        stripePaymentLink: {
          allowNull: true,
          type: Sequelize.JSON
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE
        },
        adminId: {
          onDelete: "SET NULL",
          onUpdate: "CASCADE",
          references: {
            model: "admin",
            key: "id"
          },
          allowNull: true,
          type: Sequelize.INTEGER
        },
        landlordId: {
          onDelete: "SET NULL",
          onUpdate: "CASCADE",
          references: {
            model: "listing_landlords",
            key: "id"
          },
          allowNull: true,
          type: Sequelize.INTEGER
        }
      },
      {}
    ]
  },

  {
    fn: "createTable",
    params: [
      "listing_media",
      {
        id: {
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        mediaType: {
          allowNull: false,
          type: Sequelize.STRING
        },
        fileFormat: {
          allowNull: false,
          type: Sequelize.STRING
        },
        s3BucketKey: {
          allowNull: false,
          type: Sequelize.STRING
        },
        mediaUrl: {
          allowNull: false,
          type: Sequelize.TEXT
        },
        label: {
          allowNull: true,
          type: Sequelize.STRING
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE
        },
        listingId: {
          onDelete: "SET NULL",
          onUpdate: "CASCADE",
          references: {
            model: "listings",
            key: "id"
          },
          allowNull: true,
          type: Sequelize.INTEGER
        }
      },
      {}
    ]
  },

  {
    fn: "createTable",
    params: [
      "listing_questions",
      {
        id: {
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        text: {
          allowNull: false,
          type: Sequelize.TEXT
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE
        },
        listingId: {
          onDelete: "SET NULL",
          onUpdate: "CASCADE",
          references: {
            model: "listings",
            key: "id"
          },
          allowNull: true,
          type: Sequelize.INTEGER
        }
      },
      {}
    ]
  },

  {
    fn: "createTable",
    params: [
      "listing_saves",
      {
        id: {
          primaryKey: true,
          type: Sequelize.UUID
        },
        ipAddress: {
          allowNull: false,
          type: Sequelize.STRING
        },
        visitorId: {
          allowNull: false,
          type: Sequelize.UUID
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE
        },
        listingId: {
          onDelete: "SET NULL",
          onUpdate: "CASCADE",
          references: {
            model: "listings",
            key: "id"
          },
          allowNull: true,
          type: Sequelize.INTEGER
        },
        userId: {
          onDelete: "NO ACTION",
          onUpdate: "CASCADE",
          references: {
            model: "users",
            key: "id"
          },
          allowNull: false,
          type: Sequelize.INTEGER
        }
      },
      {}
    ]
  },

  {
    fn: "createTable",
    params: [
      "listing_views",
      {
        id: {
          primaryKey: true,
          type: Sequelize.UUID
        },
        ipAddress: {
          allowNull: false,
          type: Sequelize.STRING
        },
        visitorId: {
          allowNull: false,
          type: Sequelize.UUID
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE
        },
        listingId: {
          onDelete: "SET NULL",
          onUpdate: "CASCADE",
          references: {
            model: "listings",
            key: "id"
          },
          allowNull: true,
          type: Sequelize.INTEGER
        },
        userId: {
          onDelete: "SET NULL",
          onUpdate: "CASCADE",
          references: {
            model: "users",
            key: "id"
          },
          allowNull: true,
          type: Sequelize.INTEGER
        }
      },
      {}
    ]
  },

  {
    fn: "createTable",
    params: [
      "messages",
      {
        id: {
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        messageText: {
          allowNull: false,
          type: Sequelize.TEXT
        },
        messageType: {
          allowNull: false,
          type: Sequelize.STRING
        },
        seenAt: {
          allowNull: true,
          type: Sequelize.DATE
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE
        },
        userId: {
          onDelete: "SET NULL",
          onUpdate: "CASCADE",
          references: {
            model: "users",
            key: "id"
          },
          allowNull: true,
          type: Sequelize.INTEGER
        },
        enquiryConversationId: {
          onDelete: "CASCADE",
          onUpdate: "CASCADE",
          references: {
            model: "enquiry_conversation",
            key: "id"
          },
          allowNull: true,
          type: Sequelize.INTEGER
        }
      },
      {}
    ]
  },

  {
    fn: "createTable",
    params: [
      "offers",
      {
        id: {
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE
        },
        userId: {
          onDelete: "SET NULL",
          onUpdate: "CASCADE",
          references: {
            model: "users",
            key: "id"
          },
          allowNull: true,
          type: Sequelize.INTEGER
        },
        listingId: {
          onDelete: "SET NULL",
          onUpdate: "CASCADE",
          references: {
            model: "listings",
            key: "id"
          },
          allowNull: true,
          type: Sequelize.INTEGER
        }
      },
      {}
    ]
  },

  {
    fn: "createTable",
    params: [
      "profiles",
      {
        id: {
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        firstName: {
          allowNull: true,
          type: Sequelize.STRING
        },
        lastName: {
          allowNull: true,
          type: Sequelize.STRING
        },
        email: {
          allowNull: true,
          type: Sequelize.STRING
        },
        phoneNumber: {
          allowNull: true,
          type: Sequelize.STRING
        },
        addressLine1: {
          allowNull: true,
          type: Sequelize.STRING
        },
        addressLine2: {
          allowNull: true,
          type: Sequelize.STRING
        },
        city: {
          allowNull: true,
          type: Sequelize.STRING
        },
        settlement: {
          allowNull: true,
          type: Sequelize.STRING
        },
        postcode: {
          allowNull: true,
          type: Sequelize.STRING
        },
        country: {
          allowNull: true,
          type: Sequelize.STRING
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE
        },
        userId: {
          onDelete: "SET NULL",
          onUpdate: "CASCADE",
          references: {
            model: "users",
            key: "id"
          },
          allowNull: true,
          type: Sequelize.INTEGER
        }
      },
      {}
    ]
  },

  {
    fn: "createTable",
    params: [
      "profile_media",
      {
        id: {
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        mediaType: {
          allowNull: false,
          type: Sequelize.STRING
        },
        mediaFormat: {
          allowNull: false,
          type: Sequelize.STRING
        },
        s3BucketKey: {
          allowNull: false,
          type: Sequelize.STRING
        },
        mediaUrl: {
          allowNull: false,
          type: Sequelize.STRING
        },
        label: {
          allowNull: true,
          type: Sequelize.STRING
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE
        },
        profileId: {
          onDelete: "SET NULL",
          onUpdate: "CASCADE",
          references: {
            model: "profiles",
            key: "id"
          },
          allowNull: true,
          type: Sequelize.INTEGER
        }
      },
      {}
    ]
  },

  {
    fn: "createTable",
    params: [
      "expenses",
      {
        id: {
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        date: {
          allowNull: false,
          type: Sequelize.DATE
        },
        description: {
          allowNull: false,
          type: Sequelize.STRING
        },
        amount: {
          allowNull: false,
          type: Sequelize.DECIMAL(20, 2)
        },
        stripePaymentInfo: {
          allowNull: true,
          type: Sequelize.JSON
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE
        },
        propertyForRentId: {
          onDelete: "SET NULL",
          onUpdate: "CASCADE",
          references: {
            model: "property_for_rent",
            key: "id"
          },
          allowNull: true,
          type: Sequelize.INTEGER
        }
      },
      {}
    ]
  },

  {
    fn: "createTable",
    params: [
      "property_documents",
      {
        id: {
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        mediaType: {
          allowNull: false,
          type: Sequelize.STRING
        },
        mediaFormat: {
          allowNull: false,
          type: Sequelize.STRING
        },
        s3BucketKey: {
          allowNull: false,
          type: Sequelize.STRING
        },
        mediaUrl: {
          allowNull: false,
          type: Sequelize.STRING
        },
        label: {
          allowNull: true,
          type: Sequelize.STRING
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE
        },
        propertyForRentId: {
          onDelete: "SET NULL",
          onUpdate: "CASCADE",
          references: {
            model: "property_for_rent",
            key: "id"
          },
          allowNull: true,
          type: Sequelize.INTEGER
        }
      },
      {}
    ]
  },

  {
    fn: "createTable",
    params: [
      "property_for_sale",
      {
        id: {
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        sqFt: {
          allowNull: false,
          type: Sequelize.DECIMAL
        },
        availability: {
          allowNull: false,
          type: Sequelize.DATEONLY
        },
        numOfRooms: {
          allowNull: false,
          type: Sequelize.INTEGER
        },
        numOfBathRooms: {
          allowNull: false,
          type: Sequelize.INTEGER
        },
        isFurnished: {
          allowNull: false,
          type: Sequelize.BOOLEAN
        },
        saleAmount: {
          allowNull: false,
          type: Sequelize.INTEGER
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE
        },
        listingId: {
          onDelete: "CASCADE",
          onUpdate: "CASCADE",
          references: {
            model: "listings",
            key: "id"
          },
          allowNull: true,
          type: Sequelize.INTEGER
        }
      },
      {}
    ]
  },

  {
    fn: "createTable",
    params: [
      "property_tenants",
      {
        id: {
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        rentalAgreementDate: {
          allowNull: true,
          type: Sequelize.DATE
        },
        deposit: {
          allowNull: true,
          type: Sequelize.DECIMAL(20, 2)
        },
        isDepositPaid: {
          allowNull: true,
          type: Sequelize.BOOLEAN
        },
        outstandingRent: {
          allowNull: true,
          type: Sequelize.DECIMAL(20, 2)
        },
        isDepositReleased: {
          allowNull: true,
          type: Sequelize.BOOLEAN
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE
        },
        propertyForRentId: {
          onDelete: "SET NULL",
          onUpdate: "CASCADE",
          references: {
            model: "property_for_rent",
            key: "id"
          },
          allowNull: true,
          type: Sequelize.INTEGER
        },
        userId: {
          onDelete: "NO ACTION",
          onUpdate: "CASCADE",
          references: {
            model: "users",
            key: "id"
          },
          allowNull: false,
          type: Sequelize.INTEGER
        }
      },
      {}
    ]
  }
];

const rollbackCommands = [
  {
    fn: "bulkDelete",
    params: [
      "SequelizeMigrationsMeta",
      [
        {
          revision: info.revision
        }
      ],
      {}
    ]
  },

  {
    fn: "dropTable",
    params: ["listing_landlords"]
  },
  {
    fn: "dropTable",
    params: ["admin"]
  },
  {
    fn: "dropTable",
    params: ["addresses"]
  },
  {
    fn: "dropTable",
    params: ["property_for_rent"]
  },
  {
    fn: "dropTable",
    params: ["enquiry_conversation"]
  },
  {
    fn: "dropTable",
    params: ["land_for_sale"]
  },
  {
    fn: "dropTable",
    params: ["listings"]
  },
  {
    fn: "dropTable",
    params: ["listing_media"]
  },
  {
    fn: "dropTable",
    params: ["listing_questions"]
  },
  {
    fn: "dropTable",
    params: ["listing_saves"]
  },
  {
    fn: "dropTable",
    params: ["listing_views"]
  },
  {
    fn: "dropTable",
    params: ["messages"]
  },
  {
    fn: "dropTable",
    params: ["offers"]
  },
  {
    fn: "dropTable",
    params: ["profiles"]
  },
  {
    fn: "dropTable",
    params: ["profile_media"]
  },
  {
    fn: "dropTable",
    params: ["expenses"]
  },
  {
    fn: "dropTable",
    params: ["property_documents"]
  },
  {
    fn: "dropTable",
    params: ["property_for_sale"]
  },
  {
    fn: "dropTable",
    params: ["property_tenants"]
  },
  {
    fn: "dropTable",
    params: ["feedback"]
  },
  {
    fn: "dropTable",
    params: ["users"]
  }
];

module.exports = {
  pos: 0,
  up: function (queryInterface, Sequelize) {
    let index = this.pos;

    return new Promise(function (resolve, reject) {
      function next() {
        if (index < migrationCommands.length) {
          let command = migrationCommands[index];
          console.log("[#" + index + "] execute: " + command.fn);
          index++;
          queryInterface[command.fn].apply(queryInterface, command.params).then(next, reject);
        } else resolve();
      }

      next();
    });
  },
  down: function (queryInterface, Sequelize) {
    let index = this.pos;

    return new Promise(function (resolve, reject) {
      function next() {
        if (index < rollbackCommands.length) {
          let command = rollbackCommands[index];
          console.log("[#" + index + "] execute: " + command.fn);
          index++;
          queryInterface[command.fn].apply(queryInterface, command.params).then(next, reject);
        } else resolve();
      }

      next();
    });
  },
  info
};
