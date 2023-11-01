const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Cycle extends Model {
    static associate(models) {
      Cycle.belongsTo(models.Card, {
        foreignKey: "cardId",
      });
    }
  }
  Cycle.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    cardId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'card_id',
    },
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: "start_date",
    },
    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: "end_date",
    },
    dueDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: "due_date",
    },
    createdAt: {
      allowNull: false,
      type: sequelize.DATEONLY,
      defaultValue: sequelize.fn('now'),
      field: "created_at",
    },
    updatedAt: {
      allowNull: false,
      type: sequelize.DATEONLY,
      defaultValue: sequelize.fn('now'),
      field: "updated_at",
    }
  }, {
    sequelize,
    modelName: 'Cycle',
    tableName: 'cycles',
  });
  return Cycle;
};