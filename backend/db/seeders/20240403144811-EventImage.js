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
      url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRp_kH4cm3PceLgGcc-vZWnUs5-jGydDr5G6w&s",
      preview: true},
      {eventId: 3,
      url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7Sjb9OLrmkzMwHB_8lqQZnBw4G1cIGoVdbw&s",
      preview: true},
      {eventId: 2,
      url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ5SQ4YQTfEtO1PGORz08vfdz45KmFd-fpZ4A&s",
      preview: true},
      {eventId: 4,
        url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLsvfHKJ3X2_jPHIcRfFX0l2tcV-HNwIZEKg&s",
        preview: true},
        {eventId: 5,
          url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTkbHwlHq_Uj64Mj26U4eKpv8nMSXwdurCPjw&s",
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
      url: {[Op.in]: ["aaaaaaaaaa","bbbbbbbbbb","cccccccccc", "dddddddddd", "eeeeeeeeee"]}
    }, {})
  }
};
