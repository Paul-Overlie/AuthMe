'use strict';
const {
  Model, Validator
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Event.hasMany(models.Attendance, {foreignKey: "eventId",
      onDelete: "SET NULL"})

      Event.belongsTo(models.Group, {foreignKey: "groupId"})

      Event.belongsTo(models.Venue, {foreignKey: "venueId"})

      Event.hasMany(models.EventImage, {foreignKey: "eventId",
      onDelete: "SET NULL"})
    }
  }
  Event.init({
    venueId: DataTypes.INTEGER,
    groupId: DataTypes.INTEGER,
    name: {type:DataTypes.STRING,
    validate: {
      len: [5,1000000000]
    }},
    description: {type:DataTypes.STRING,
    allowNull: false},
    type: {
      type: DataTypes.ENUM,
      values: ["Online", "In person"]},
    capacity: DataTypes.INTEGER,
    price: DataTypes.DECIMAL,
    startDate: DataTypes.DATE,
    endDate: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Event',
    defaultScope: {
      attributes: {
        exclude: ["createdAt", "updatedAt"]
      }
    }
  });
  return Event;
};