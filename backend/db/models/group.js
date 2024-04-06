'use strict';
const {
  Model, Validator
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Group extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Group.belongsTo(models.User, {foreignKey: "organizerId"})

      Group.hasMany(models.Membership, {foreignKey: "groupId",
      onDelete: "SET NULL"})

      Group.hasMany(models.GroupImage, {foreignKey: "groupId",
      onDelete: "SET NULL"})

      Group.hasMany(models.Venue, {foreignKey: "groupId",
      onDelete: "SET NULL"})

      Group.hasMany(models.Event, {foreignKey: "groupId",
      onDelete: "SET NULL"})
    }
  }
  Group.init({
    organizerId: DataTypes.INTEGER,
    name: { type: DataTypes.STRING(60),
      validate: {
        len: [0, 60]
      }},
    about: {type: DataTypes.STRING,
      validate: {
        len: [50, 1000000000]
      }},
    type: {
      type: DataTypes.ENUM,
      values: ["In person", "Online"]},
    private: DataTypes.BOOLEAN,
    city: {type: DataTypes.STRING,
      allowNull: false},
    state: {type: DataTypes.STRING,
      allowNull:false}
  }, {
    sequelize,
    modelName: 'Group',
    defaultScope: {
      attributes: {
        exclude: ["createdAt", "updatedAt"]
      }
    }
  });
  return Group;
};