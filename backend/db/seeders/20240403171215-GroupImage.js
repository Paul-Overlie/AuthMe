'use strict';

/** @type {import('sequelize-cli').Migration} */

const {GroupImage}=require('../models')
const bcrypt=require("bcryptjs")

let options = {}
if(process.env.NODE_ENV==='production'){
  options.schema=process.env.schema
}

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
   await GroupImage.bulkCreate([
    {groupId: 3,
    url: "1234567890",
    preview: true},

    {groupId: 2,
    url: "0987654321",
    preview: true},

    {groupId: 1,
    url: "asdf",
    preview: true},

    {groupId: 4,
      url: "fdsa",
      preview: true},

      {groupId: 5,
        url: "jk",
        preview: true}
   ])
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = "GroupImages"
    const Op=Sequelize.Op
    await queryInterface.bulkDelete(options, {
      url: {[Op.in]: ["1234567890", "0987654321", "asdf", "fdsa", "jk"]}
    })
  }
};
