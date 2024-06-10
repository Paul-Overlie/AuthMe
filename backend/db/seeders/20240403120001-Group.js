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
    name: "This is a name so long that it will have",
    about: "Looney Tunes and Merrie Melodies were initially produced by Leon Schlesinger and animators Hugh Harman and Rudolf Ising from 1930 to 1933.[3] Schlesinger assumed full production from 1933 until he sold his studio to Warner Bros. in 1944",
    type: "In person",
    private: true,
    city: "Houston",
    state: "Texas"},

    {organizerId: 3,
    name: "Medium",
    about: "Looney Tunes and Merrie Melodies were initially produced by Leon Schlesinger and animators Hugh Harman and Rudolf Ising from 1930 to 1933.[3] Schlesinger assumed full production from 1933 until he sold his studio to Warner Bros. in 1944",
    type: "Online",
    private: false,
    city: "Dallas",
    state: "Texas"},

    {organizerId: 2,
    name: "Large",
    about: "Fee fi foaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    type: "In person",
    private: false,
    city: "Atlanta",
    state: "Georgia"},
    
    {organizerId: 1,
      name: "XLarge",
      about: "Big ol guyaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      type: "In person",
      private: true,
      city: "WackaWacka",
      state: "SesameState"},

      {organizerId: 2,
        name: "XSmall",
        about: "Just a little guyaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
        type: "In person",
        private: false,
        city: "Gotham",
        state: "DC"}
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
      name: {[Op.in]: ["Small", "Medium", "Large", "XLarge", "XSmall"]}
    }, {})
  }
};
