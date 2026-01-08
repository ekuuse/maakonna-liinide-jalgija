'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize: any, DataTypes: any) => {
  class BusTime extends Model { 
    static associate(models: { Bus: any }): void {
      this.belongsToMany(models.Bus, {
        foreignKey: 'bus_id',
        through: 'Bus'
      })
    }
  }
  BusTime.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    bus_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    stop_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    when: {
      type: DataTypes.DATE,
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'BusTime',
    freezeTableName: true,
  });
  return BusTime;
};