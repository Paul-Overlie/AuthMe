'use strict';

/** @type {import('sequelize-cli').Migration} */

const {Attendance}=require('../models')
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
   await Attendance.bulkCreate([
    {eventId: 3,
    userId: 1,
    status: "attending"},
    {eventId: 2,
    userId: 3,
    status: "waitlist"},
    {eventId: 1,
    userId: 2,
    status: "pending"},
    {eventId: 1,
      userId: 4,
      status: "attending"},
      {eventId: 1,
        userId: 3,
        status: "waitlist"}
   ])
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = "Attendances"
    const Op = Sequelize.Op
    return queryInterface.bulkDelete(options, {
      id: { [Op.in]: [1, 2, 3, 4, 5]}
    }, {})
  }
};
