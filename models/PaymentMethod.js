const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PaymentMethod extends Model {
    static associate(models) {
      PaymentMethod.belongsToMany(models.Expense, {
        through: models.ExpensePayment,
        foreignKey: 'paymentId',
      });
      PaymentMethod.belongsToMany(models.Card, {
        through: models.PaymentCard,
        foreignKey: 'paymentId',
      });
    }
  }
  PaymentMethod.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
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
    modelName: 'PaymentMethod',
    tableName: 'payment_methods',
  });
  return PaymentMethod;
};