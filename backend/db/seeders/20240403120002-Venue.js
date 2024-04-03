'use strict';

/** @type {import('sequelize-cli').Migration} */

const {Venue}=require('../models')
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
   await Venue.bulkCreate([
    {groupId: 3,
    address: "123 Happy Hollow",
    city: "HappyTown",
    state: "Happy",
    lat: 3.9,
    lng: 6.5},

    {groupId: 2,
    address: "321 Dry Eagle",
    city: "San Antonio",
    state: "Texas",
    lat: 34.6,
    lng: 87.6},

    {groupId: 1,
    address: "147 Lovorn",
    city: "Houston County",
    state: "Georgia",
    lat: 12.3,
    lng: 45.6}
   ])
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = "Venues"
    const Op = Sequelize.Op
    return queryInterface.bulkDelete(options, {
      address: {[Op.in]: ["123 Happy Hollow", "321 Dry Eagle", "147 Lovorn"]}
    })
  }
};
