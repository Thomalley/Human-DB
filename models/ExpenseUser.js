const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ExpenseUser extends Model {
    static associate(models) {
      ExpenseUser.belongsTo(models.Expense, {
        foreignKey: "expenseId",
      });
      ExpenseUser.belongsTo(models.User, {
        foreignKey: "userId",
      });
    }
  }
  ExpenseUser.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    expenseId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "expense_id",
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "user_id",
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
    modelName: 'ExpenseUser',
    tableName: 'expenses_users',
  });
  return ExpenseUser;
};