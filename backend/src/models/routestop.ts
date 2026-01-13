'use strict';

module.exports = (sequelize: any, DataTypes: any) => {
  const { Model } = require('sequelize');
  class RouteStop extends Model {
    static associate(models: any): void {
      this.belongsTo(models.Route, {
        foreignKey: 'route_id',
        as: 'route'
      });
    }
  }
  RouteStop.init({
    route_stop_id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    route_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Route',
        key: 'route_id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    stop_order: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    stop_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    platform: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    arrives: {
      type: DataTypes.TIME,
      allowNull: true
    },
    leaves: {
      type: DataTypes.TIME,
      allowNull: true
    },
    extra_info: {
      type: DataTypes.STRING,
      allowNull: true
    },
  }, {
    sequelize,
    modelName: 'RouteStop',
    freezeTableName: true,
    timestamps: false,
  });
  return RouteStop;
};
