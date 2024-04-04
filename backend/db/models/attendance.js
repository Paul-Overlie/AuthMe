'use strict';
const {
  Model, Validator
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Attendance extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Attendance.belongsTo(models.User, {foreignKey: "userId",
    onDelete: "SET NULL"})

      Attendance.belongsTo(models.Event, {foreignKey: "eventId",
    onDelete: "SET NULL"})
    }
  }
  Attendance.init({
    eventId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    status: {
      type: DataTypes.ENUM,
      values: ["present", "absent"]}
  }, {
    sequelize,
    modelName: 'Attendance',
    defaultScope: {
      attributes: {
        exclude: ["createdAt", "updatedAt"]
      }
    }
  });
  return Attendance;
};