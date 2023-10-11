"use strict";

const usersArray = require("../fake-data/users");
const listingsArray = require("../fake-data/listings");
const addressesArray = require("../fake-data/addresses");
const propertyForRentArray = require("../fake-data/property_for_rent");
const propertyForSaleArray = require("../fake-data/property_for_sale");
const listingMediaArray = require("../fake-data/listing_media");
const enqConvoArray = require("../fake-data/enquiry_conversation");
const messagesArray = require("../fake-data/messages");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    try {
      await queryInterface.bulkInsert("users", usersArray, {});
      await queryInterface.sequelize.query(`ALTER SEQUENCE users_id_seq RESTART WITH ${usersArray.length + 1}`);

      await queryInterface.bulkInsert("admin", [
        { id: 1, verified: true, phone: "123456", userId: 1, createdAt: "2021-05-28T15:36:56.200", updatedAt: "2021-08-28T13:40:02.200" },
        { id: 2, verified: true, phone: "123456", userId: 5, createdAt: "2021-05-28T15:36:56.200", updatedAt: "2021-08-28T13:40:02.200" }
      ]);
      await queryInterface.sequelize.query("ALTER SEQUENCE admin_id_seq RESTART WITH 3;");
    } catch (err) {
      // @ts-ignore
      console.log("Error occured while bulk insert Users", err?.original?.message);
    }

    try {
      // Listing
      await queryInterface.bulkInsert("listings", listingsArray, {});
      await queryInterface.sequelize.query(`ALTER SEQUENCE listings_id_seq RESTART WITH ${listingsArray.length + 1}`);
      //Address
      // PropertyForRent
      // ListingQuestion
      // ListingMedia
    } catch (err) {
      // @ts-ignore
      console.log("Error occured while bulk insert Listings", err?.original?.message);
    }

    try {
      //Address
      await queryInterface.bulkInsert("addresses", addressesArray, {});
      await queryInterface.sequelize.query(`ALTER SEQUENCE addresses_id_seq RESTART WITH ${addressesArray.length + 1}`);
    } catch (err) {
      // @ts-ignore
      console.log("Error occured while bulk insert Addresses", err?.original?.message);
    }

    try {
      // PropertyForRent PropertyForSale
      await queryInterface.bulkInsert("property_for_rent", propertyForRentArray, {});
      await queryInterface.sequelize.query(`ALTER SEQUENCE property_for_rent_id_seq RESTART WITH ${propertyForRentArray.length + 1}`);

      await queryInterface.bulkInsert("property_for_sale", propertyForSaleArray, {});
      await queryInterface.sequelize.query(`ALTER SEQUENCE property_for_sale_id_seq RESTART WITH ${propertyForSaleArray.length + 1}`);
    } catch (err) {
      // @ts-ignore
      console.log("Error occured while bulk insert PropertyForRent", err?.original?.message);
    }

    try {
      // ListingMedia
      await queryInterface.bulkInsert("listing_media", listingMediaArray, {});
      await queryInterface.sequelize.query(`ALTER SEQUENCE listing_media_id_seq RESTART WITH ${listingMediaArray.length + 1}`);
    } catch (err) {
      // @ts-ignore
      console.log("Error occured while bulk insert ListingMedia", err?.original?.message);
    }

    try {
      // EnquiryConversation
      await queryInterface.bulkInsert("enquiry_conversation", enqConvoArray, {});
      await queryInterface.sequelize.query(`ALTER SEQUENCE enquiry_conversation_id_seq RESTART WITH ${enqConvoArray.length + 1}`);
    } catch (err) {
      // @ts-ignore
      console.log("Error occured while bulk insert EnquiryConversation", err?.original?.message);
    }

    try {
      // Message
      await queryInterface.bulkInsert("messages", messagesArray, {});
      await queryInterface.sequelize.query(`ALTER SEQUENCE messages_id_seq RESTART WITH ${messagesArray.length + 1}`);
    } catch (err) {
      // @ts-ignore
      console.log("Error occured while bulk insert Message", err?.original?.message);
    }
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
