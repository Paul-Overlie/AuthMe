'use strict';

/** @type {import('sequelize-cli').Migration} */

const {Group}=require('../models')
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
   await Group.bulkCreate([
    {organizerId: 1,
    name: "Small",
    about: "Just a little guy",
    type: "red",
    private: true,
    city: "Houston",
    state: "Texas"},

    {organizerId: 3,
    name: "Medium",
    about: "Center of the pack",
    type: "yellow",
    private: false,
    city: "Dallas",
    state: "Texas"},

    {organizerId: 2,
    name: "Large",
    about: "Fee fi fo",
    type: "blue",
    private: false,
    city: "Atlanta",
    state: "Georgia"}
   ])
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = "Groups"
    const Op = Sequelize.Op
    return queryInterface.bulkDelete(options, {

    }, {})
  }
};
