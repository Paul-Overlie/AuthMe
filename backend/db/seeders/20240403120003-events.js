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
    name: "this is going to be a very long title to make sure that if it is needed my sections are wrapping then I can be very pleasede",
    description: "Looney Tunes and Merrie Melodies were initially produced by Leon Schlesinger and animators Hugh Harman and Rudolf Ising from 1930 to 1933.[3] Schlesinger assumed full production from 1933 until he sold his studio to Warner Bros. in 1944, after which it was renamed Warner Bros. Cartoons.[3] The Looney Tunes title was inspired by that of Walt Disney's Silly Symphonies.[3] The shorts initially showcased musical compositions owned by Warner's music publishing interests through the adventures of such characters as Bosko and Buddy.[3] However, the shorts gained a higher profile upon the debuts of directors Tex Avery, Friz Freleng, Chuck Jones, and Bob Clampett and voice actor Mel Blanc later in the decade.[3] Porky Pig and Daffy Duck became the featured Looney Tunes characters, while Merrie Melodies featured one-shot cartoons and minor recurring characters.[3]",
    type: "Online",
    capacity: 30,
    price: 300,
    startDate: "11/2/1997",
    endDate: "10/24/1999"},

    {venueId: 3,
    groupId: 1,
    name: "How long does a title need to be you may ask? I think that it should be about this long!",
    description: "Looney Tunes and Merrie Melodies were initially produced by Leon Schlesinger and animators Hugh Harman and Rudolf Ising from 1930 to 1933.[3] Schlesinger assumed full production from 1933 until he sold his studio to Warner Bros. in 1944, after which it was renamed Warner Bros. Cartoons.[3] The Looney Tunes title was inspired by that of Walt Disney's Silly Symphonies.[3] The shorts initially showcased musical compositions owned by Warner's music publishing interests through the adventures of such characters as Bosko and Buddy.[3] However, the shorts gained a higher profile upon the debuts of directors Tex Avery, Friz Freleng, Chuck Jones, and Bob Clampett and voice actor Mel Blanc later in the decade.[3] Porky Pig and Daffy Duck became the featured Looney Tunes characters, while Merrie Melodies featured one-shot cartoons and minor recurring characters.[3]",
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
