'use strict';
const {
  Model: BusModel
} = require('sequelize');
module.exports = (sequelize: any, DataTypes: any) => {
  class Bus extends BusModel {}
  Bus.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    linenr: {
      type: DataTypes.STRING,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    route: {
      type: DataTypes.STRING,
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'Bus',
  });
  return Bus;
};