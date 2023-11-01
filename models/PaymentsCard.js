const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PaymentCard extends Model {
    static associate(models) {
      PaymentCard.belongsTo(models.PaymentMethod, {
        foreignKey: "paymentId",
      });
      PaymentCard.belongsTo(models.Card, {
        foreignKey: "cardId",
      });
    }
  }
  PaymentCard.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    paymentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'payment_id',
    },
    cardId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'card_id',
    },
    installments: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    installmentAmount: {
      type: DataTypes.FLOAT,
      allowNull: false,
      field: 'installment_amount',
    },
    installmentsLeft: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'installments_left',
      defaultValue: 0,
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
    modelName: 'PaymentCard',
    tableName: 'payments_cards',
  });
  return PaymentCard;
};