'use strict';
const {
  Model: BusModel
} = require('sequelize');
module.exports = (sequelize: any, DataTypes: any) => {
  class Bus extends BusModel {
    static associate(models: any): void {
      this.hasMany(models.Route, {
        foreignKey: 'bus_id',
        as: 'routes'
      });
    }
  }
  Bus.init({
    bus_id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    line_nr: {
      type: DataTypes.STRING,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true
    },
  }, {
    sequelize,
    modelName: 'Bus',
    freezeTableName: true,
    timestamps: false,
  });
  return Bus;
};