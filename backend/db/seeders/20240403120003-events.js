'use strict';

/** @type {import('sequelize-cli').Migration} */

const {Event}=require('../models')
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
   await Event.bulkCreate([
    {venueId: 1,
    groupId: 2,
    name: "telephone",
    description: "call people",
    type: "Online",
    capacity: 30,
    price: 300,
    startDate: "11/2/1997",
    endDate: "10/24/1999"},

    {venueId: 3,
    groupId: 1,
    name: "dance party",
    description: "really fun dancing",
    type: "In person",
    capacity: 100,
    price: 100,
    startDate: "12-31-2024",
    endDate: "1-1-2025"},

    {venueId: 2,
      groupId:3,
    name: "apple bobbing",
    description: "...you bob for apples",
    type: "In person",
    capacity: 25,
    price: 10,
    startDate: "4/3/2024",
    endDate: "5/5/2024"},

    {venueId: 1,
      groupId:1,
      name: "Happy Birthday",
      description: "pinata time babyssssss",
      type: "In person",
      capacity: 30,
      price: 100,
      startDate: "5/3/2024",
      endDate: "6/5/2024"},

      {venueId: 2,
        groupId:2,
        name: "carrot bobbing",
        description: "...you bob for carrots",
        type: "Online",
        capacity: 1000,
        price: 23,
        startDate: "7/3/2024",
        endDate: "8/5/2024"}
   ]
   )
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = "Events"
    const Op = Sequelize.Op
    return queryInterface.bulkDelete(options, {
      name: {[Op.in]: ["telephone", "dance party", "apple bobbing", "Happy Birthday", "carrot bobbing"]}
    }, {})
  }
};
