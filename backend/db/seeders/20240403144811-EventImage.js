'use strict';

/** @type {import('sequelize-cli').Migration} */

const {EventImage}=require('../models')
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
    await EventImage.bulkCreate([
      {eventId: 1,
      url: "aaaaaaaaaa",
      preview: true},
      {eventId: 3,
      url: "bbbbbbbbbb",
      preview: false},
      {eventId: 2,
      url: "cccccccccc",
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
    options.tableName = "EventImages"
    const Op = Sequelize.Op
    return queryInterface.bulkDelete(options, {
      url: {[Op.in]: ["aaaaaaaaaa","bbbbbbbbbb","cccccccccc"]}
    })
  }
};
