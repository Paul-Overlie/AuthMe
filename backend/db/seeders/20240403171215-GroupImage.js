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
    url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ9Th5xIGLDYwgVFyOmx-jgdDnvA37WwK-MDQ&s",
    preview: true},

    {groupId: 2,
    url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0UotGPCW4XiWO3yRHoQGGBCjHNVwbev6DRw&s",
    preview: true},

    {groupId: 1,
    url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdXMEsrH8AJH2cyFEa_enceEqP37f9B_Rp_g&s",
    preview: true},

    {groupId: 4,
      url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ5UpxwYMVAW5kdW6fuwR4oPO5e4ugdtraI5A&s",
      preview: true},

      {groupId: 5,
        url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR1Xr6JTe1OEE69GZYEuDpnxLBjzamQfLnLFA&s",
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
