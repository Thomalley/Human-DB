const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ExpensePayment extends Model {
    static associate(models) {
      ExpensePayment.belongsTo(models.Expense, {
        foreignKey: "expenseId",
      });
      ExpensePayment.belongsTo(models.PaymentMethod, {
        foreignKey: "paymentId",
      });
    }
  }
  ExpensePayment.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    expenseId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'expense_id',
    },
    paymentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'payment_id',
    },
    amountPayed: {
      type: DataTypes.FLOAT,
      allowNull: false,
      field: 'amount_payed',
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
    modelName: 'ExpensePayment',
    tableName: 'expenses_payments',
  });
  return ExpensePayment;
};