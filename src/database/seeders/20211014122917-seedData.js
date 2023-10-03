"use strict";

const usersArray = require("../fake-data/users");
const listingsArray = require("../fake-data/listings");
const addressesArray = require("../fake-data/addresses");
const propertyForRentArray = require("../fake-data/property_for_rent");
const propertyForSaleArray = require("../fake-data/property_for_sale");
const listingMediaArray = require("../fake-data/listing_media");

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
      await queryInterface.bulkInsert("landlords", [
        { id: 1, verified: true, phone: "123456", userId: 1, createdAt: "2021-05-28T15:36:56.200", updatedAt: "2021-08-28T13:40:02.200" },
        { id: 2, verified: true, phone: "123456", userId: 5, createdAt: "2021-05-28T15:36:56.200", updatedAt: "2021-08-28T13:40:02.200" }
      ]);
    } catch (err) {
      // @ts-ignore
      console.log("Error occured while bulk insert Users", err?.original?.message);
    }

    try {
      // Listing
      await queryInterface.bulkInsert("listings", listingsArray, {});
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
    } catch (err) {
      // @ts-ignore
      console.log("Error occured while bulk insert Addresses", err?.original?.message);
    }

    try {
      // PropertyForRent PropertyForSale
      await queryInterface.bulkInsert("property_for_rent", propertyForRentArray, {});
      await queryInterface.bulkInsert("property_for_sale", propertyForSaleArray, {});
    } catch (err) {
      // @ts-ignore
      console.log("Error occured while bulk insert PropertyForRent", err?.original?.message);
    }

    try {
      await queryInterface.bulkInsert("listing_media", listingMediaArray, {});
    } catch (err) {
      // @ts-ignore
      console.log("Error occured while bulk insert ListingMedia", err?.original?.message);
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
