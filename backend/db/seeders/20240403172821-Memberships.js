'use strict';

/** @type {import('sequelize-cli').Migration} */

const {Membership}=require('../models')
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
   await Membership.bulkCreate([
    {userId: 1,
    groupId: 2,
    status: "Gold"},

    {userId: 2,
    groupId: 3,
    status: "Silver"},

    {userId: 3,
    groupId: 1,
    status: "Bronze"}
   ])
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = "Memberships"
    const Op = Sequelize.Op
    await queryInterface.bulkDelete(options, {
      id: {[Op.in]: [1,2,3]}
    })
  }
};