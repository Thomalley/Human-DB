module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('payments_cards', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      payment_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'payment_methods',
          key: 'id',
        }
      },
      card_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'cards',
          key: 'id',
        }
      },
      installments: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      installment_amount: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      installments_left: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      created_at: {
        type: Sequelize.DATEONLY,
        allowNull: false,
        defaultValue: Sequelize.fn('now'),
      },
      updated_at: {
        type: Sequelize.DATEONLY,
        allowNull: false,
        defaultValue: Sequelize.fn('now'),
      }
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('payments_cards');
  }
};