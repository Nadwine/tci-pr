'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const Op = Sequelize.Op;
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
      await queryInterface.bulkDelete("comments", { id: { [Op.not]: 0 } });
      await queryInterface.bulkDelete("media", { id: { [Op.not]: 0 } });
      await queryInterface.bulkDelete("funds", { id: { [Op.not]: 0 } });
      await queryInterface.bulkDelete("project_likes_dislikes", { id: { [Op.not]: 0 } });
      await queryInterface.bulkDelete("locations", { id: { [Op.not]: 0 } });
      await queryInterface.bulkDelete("projects", { id: { [Op.not]: 0 } });
      await queryInterface.bulkDelete("users", { id: { [Op.not]: 0 } });
    } catch (err) {
      console.log("error occurred while trying to drop tables:", err);
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
}
