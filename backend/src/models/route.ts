'use strict';

module.exports = (sequelize: any, DataTypes: any) => {
  const { Model } = require('sequelize');
  class Route extends Model {
    static associate(models: any): void {
      this.belongsTo(models.Bus, {
        foreignKey: 'bus_id',
        as: 'bus'
      });
      this.hasMany(models.RouteStop, {
        foreignKey: 'route_id',
        as: 'stops'
      });
    }
  }
  Route.init({
    route_id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    bus_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Bus',
        key: 'bus_id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    route_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    direction: {
      type: DataTypes.STRING,
      allowNull: true
    },
  }, {
    sequelize,
    modelName: 'Route',
    freezeTableName: true,
    timestamps: false,
  });
  return Route;
};
