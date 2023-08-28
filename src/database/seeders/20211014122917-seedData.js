"use strict";

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
      const usersArray = [
        {
          id: 1,
          username: "user1",
          password: "$2b$10$cqpR.FhqULDRtHEA0NHmq.PDcKP2YpslHtDV9hEjp5/cc8dwTu1Fa",
          email: "mail1@mail.com",
          createdAt: "2021-05-28T15:36:56.200",
          updatedAt: "2021-08-28T13:40:02.200"
        },
        {
          id: 1,
          username: "user1",
          password: "$2b$10$cqpR.FhqULDRtHEA0NHmq.PDcKP2YpslHtDV9hEjp5/cc8dwTu1Fa",
          email: "mail1@mail.com",
          createdAt: "2021-05-28T15:36:56.200",
          updatedAt: "2021-08-28T13:40:02.200"
        }
      ];

      await queryInterface.bulkInsert("users", usersArray, {});
    } catch (err) {
      // @ts-ignore
      console.log("Error occured while bulk insert Users", err?.original?.message);
    }

    try {
      await queryInterface.bulkInsert(
        "projects",
        [
          {
            id: 1,
            name: "project1",
            description: " this is the 1 created project",
            userID: 1,
            createdAt: "2021-05-28T15:36:56.200",
            updatedAt: "2021-08-28T13:40:02.200"
          },
          {
            id: 2,
            name: "project2",
            description: " this is the 2 created project",
            userID: 2,
            createdAt: "2021-05-28T15:36:56.200",
            updatedAt: "2021-08-28T13:40:02.200"
          },
          {
            id: 3,
            name: "project3",
            description: " this is the 3 created project",
            userID: 2,
            createdAt: "2021-05-28T15:36:56.200",
            updatedAt: "2021-08-28T13:40:02.200"
          },
          {
            id: 4,
            name: "project4",
            description: " this is the 4 created project",
            userID: 3,
            createdAt: "2021-05-28T15:36:56.200",
            updatedAt: "2021-08-28T13:40:02.200"
          },
          {
            id: 5,
            name: "project5",
            description: " this is the 5 created project",
            userID: 3,
            createdAt: "2021-05-28T15:36:56.200",
            updatedAt: "2021-08-28T13:40:02.200"
          },
          {
            id: 6,
            name: "project6",
            description: " this is the 6 created project",
            userID: 1,
            createdAt: "2021-05-28T15:36:56.200",
            updatedAt: "2021-08-28T13:40:02.200"
          },
          {
            id: 7,
            name: "project7",
            description: " this is the 7 created project",
            userID: 1,
            createdAt: "2021-05-28T15:36:56.200",
            updatedAt: "2021-08-28T13:40:02.200"
          },
          {
            id: 8,
            name: "project8",
            description: " this is the 8 created project",
            userID: 1,
            createdAt: "2021-05-28T15:36:56.200",
            updatedAt: "2021-08-28T13:40:02.200"
          },
          {
            id: 9,
            name: "project9",
            description: " this is the 9 created project",
            userID: 2,
            createdAt: "2021-05-28T15:36:56.200",
            updatedAt: "2021-08-28T13:40:02.200"
          },
          {
            id: 10,
            name: "project10",
            description: " this is the 10 created project",
            userID: 1,
            createdAt: "2021-05-28T15:36:56.200",
            updatedAt: "2021-08-28T13:40:02.200"
          }
        ],
        {}
      );
    } catch (err) {
      // @ts-ignore
      console.log("Error occured while bulk insert projects", err?.original?.message);
    }

    try {
      await queryInterface.bulkInsert(
        "locations",
        [
          {
            id: 1,
            projectID: 1,
            address: "74 street",
            city: "Manchester",
            postcode: "M1 3JW",
            country: "United Kingdom",
            createdAt: "2021-05-28T15:36:56.200",
            updatedAt: "2021-08-28T13:40:02.200"
          },
          {
            id: 2,
            projectID: 2,
            address: "74 street",
            city: "London",
            postcode: "LD1 3JW",
            country: "United Kingdom",
            createdAt: "2021-05-28T15:36:56.200",
            updatedAt: "2021-08-28T13:40:02.200"
          },
          {
            id: 3,
            projectID: 3,
            address: "80 street",
            city: "Miami",
            postcode: "M1 3JW",
            country: "United States",
            createdAt: "2021-05-28T15:36:56.200",
            updatedAt: "2021-08-28T13:40:02.200"
          },
          {
            id: 4,
            projectID: 4,
            address: "100 street",
            city: "Leeds",
            postcode: "L1 3JW",
            country: "United Kingdom",
            createdAt: "2021-05-28T15:36:56.200",
            updatedAt: "2021-08-28T13:40:02.200"
          },
          {
            id: 5,
            projectID: 5,
            address: "26 street",
            city: "Manchester",
            postcode: "M1 3JW",
            country: "United Kingdom",
            createdAt: "2021-05-28T15:36:56.200",
            updatedAt: "2021-08-28T13:40:02.200"
          },
          {
            id: 6,
            projectID: 6,
            address: "76 street",
            city: "Manchester",
            postcode: "M1 3JW",
            country: "United Kingdom",
            createdAt: "2021-05-28T15:36:56.200",
            updatedAt: "2021-08-28T13:40:02.200"
          },
          {
            id: 7,
            projectID: 7,
            address: "74 street",
            city: "London",
            postcode: "LD1 3JW",
            country: "United Kingdom",
            createdAt: "2021-05-28T15:36:56.200",
            updatedAt: "2021-08-28T13:40:02.200"
          },
          {
            id: 8,
            projectID: 8,
            address: "74 street",
            city: "Manchester",
            postcode: "M1 3JW",
            country: "United Kingdom",
            createdAt: "2021-05-28T15:36:56.200",
            updatedAt: "2021-08-28T13:40:02.200"
          },
          {
            id: 9,
            projectID: 9,
            address: "74 street",
            city: "Manchester",
            postcode: "M1 3JW",
            country: "United Kingdom",
            createdAt: "2021-05-28T15:36:56.200",
            updatedAt: "2021-08-28T13:40:02.200"
          },
          {
            id: 10,
            projectID: 10,
            address: "74 street",
            city: "Manchester",
            postcode: "M1 3JW",
            country: "United Kingdom",
            createdAt: "2021-05-28T15:36:56.200",
            updatedAt: "2021-08-28T13:40:02.200"
          }
        ],
        {}
      );
    } catch (err) {
      // @ts-ignore
      console.log("Error occured while bulk insert locations", err?.original?.message);
    }

    try {
      await queryInterface.bulkInsert(
        "project_likes_dislikes",
        [
          // each row is a JSON object
          {
            id: 1,
            ratingType: "like",
            createdAt: "2021-05-28T15:36:56.200",
            updatedAt: "2021-08-28T13:40:02.200",
            projectID: 1,
            userID: 1
          },
          {
            id: 2,
            ratingType: "like",
            createdAt: "2021-05-28T15:36:56.200",
            updatedAt: "2021-08-28T13:40:02.200",
            projectID: 2,
            userID: 2
          },
          {
            id: 4,
            ratingType: "like",
            createdAt: "2021-05-28T15:36:56.200",
            updatedAt: "2021-08-28T13:40:02.200",
            projectID: 3,
            userID: 3
          },
          {
            id: 5,
            ratingType: "dislike",
            createdAt: "2021-05-28T15:36:56.200",
            updatedAt: "2021-08-28T13:40:02.200",
            projectID: 4,
            userID: 4
          },
          {
            id: 6,
            ratingType: "dislike",
            createdAt: "2021-05-28T15:36:56.200",
            updatedAt: "2021-08-28T13:40:02.200",
            projectID: 5,
            userID: 3
          },
          {
            id: 7,
            ratingType: "dislike",
            createdAt: "2021-05-28T15:36:56.200",
            updatedAt: "2021-08-28T13:40:02.200",
            projectID: 6,
            userID: 1
          }
        ],
        {}
      );
    } catch (err) {
      // @ts-ignore
      console.log("Error occured while bulk insert project_likes_dislikes", err?.original?.message);
    }

    try {
      await queryInterface.bulkInsert(
        "media",
        [
          // each row is a JSON object
          {
            id: 1,
            mediaType: "image",
            mediaUrl: "https://picsum.photos/200/300",
            createdAt: "2021-05-28T15:36:56.200",
            updatedAt: "2021-08-28T13:40:02.200",
            projectID: 1
          },
          {
            id: 2,
            mediaType: "image",
            mediaUrl: "https://picsum.photos/500/300",
            createdAt: "2021-05-28T15:36:56.200",
            updatedAt: "2021-08-28T13:40:02.200",
            projectID: 1
          },
          {
            id: 3,
            mediaType: "image",
            mediaUrl: "https://picsum.photos/200",
            createdAt: "2021-05-28T15:36:56.200",
            updatedAt: "2021-08-28T13:40:02.200",
            projectID: 1
          },
          {
            id: 4,
            mediaType: "image",
            mediaUrl: "https://picsum.photos/200/300",
            createdAt: "2021-05-28T15:36:56.200",
            updatedAt: "2021-08-28T13:40:02.200",
            projectID: 2
          },
          {
            id: 5,
            mediaType: "image",
            mediaUrl: "https://picsum.photos/200/300",
            createdAt: "2021-05-28T15:36:56.200",
            updatedAt: "2021-08-28T13:40:02.200",
            projectID: 2
          },
          {
            id: 6,
            mediaType: "image",
            mediaUrl: "https://picsum.photos/200/300",
            createdAt: "2021-05-28T15:36:56.200",
            updatedAt: "2021-08-28T13:40:02.200",
            projectID: 3
          }
        ],
        {}
      );
    } catch (err) {
      // @ts-ignore
      console.log("Error occured while bulk insert media", err?.original?.message);
    }

    try {
      await queryInterface.bulkInsert(
        "comments",
        [
          // each row is a JSON object
          {
            id: 1,
            value: "Nice",
            createdAt: "2021-05-28T15:36:56.200",
            updatedAt: "2021-08-28T13:40:02.200",
            userID: 2,
            projectID: 2
          },
          {
            id: 2,
            value: "Great Idea",
            createdAt: "2021-05-28T15:36:56.200",
            updatedAt: "2021-08-28T13:40:02.200",
            userID: 3,
            projectID: 3
          },
          {
            id: 3,
            value: "Naa bruh",
            createdAt: "2021-05-28T15:36:56.200",
            updatedAt: "2021-08-28T13:40:02.200",
            userID: 4,
            projectID: 4
          },
          {
            id: 4,
            value: "I like",
            createdAt: "2021-05-28T15:36:56.200",
            updatedAt: "2021-08-28T13:40:02.200",
            userID: 3,
            projectID: 3
          },
          {
            id: 5,
            value: "Lol",
            createdAt: "2021-05-28T15:36:56.200",
            updatedAt: "2021-08-28T13:40:02.200",
            userID: 3,
            projectID: 5
          },
          {
            id: 6,
            value: "Are you kidding me",
            createdAt: "2021-05-28T15:36:56.200",
            updatedAt: "2021-08-28T13:40:02.200",
            userID: 1,
            projectID: 6
          }
        ],
        {}
      );
    } catch (err) {
      // @ts-ignore
      console.log("Error occured while bulk insert comments", err?.original?.message);
    }

    try {
      await queryInterface.bulkInsert(
        "funds",
        [
          {
            id: 1,
            amount: 2010,
            userID: 4,
            projectID: 1,
            createdAt: "2021-05-28T15:36:56.200",
            updatedAt: "2021-08-28T13:40:02.200"
          },
          {
            id: 2,
            amount: 20000,
            userID: 5,
            projectID: 1,
            createdAt: "2021-05-28T15:36:56.200",
            updatedAt: "2021-08-28T13:40:02.200"
          },
          {
            id: 3,
            amount: 2000,
            userID: 5,
            projectID: 2,
            createdAt: "2021-05-28T15:36:56.200",
            updatedAt: "2021-08-28T13:40:02.200"
          },
          {
            id: 4,
            amount: 2000,
            userID: 5,
            projectID: 3,
            createdAt: "2021-05-28T15:36:56.200",
            updatedAt: "2021-08-28T13:40:02.200"
          }
        ],
        {}
      );
    } catch (err) {
      // @ts-ignore
      console.log("Error occured while bulk insert comments", err?.original?.message);
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
