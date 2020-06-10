'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('url_category', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      url_id: {
        type: Sequelize.INTEGER,
        onDelete: 'cascade',
        allowNull: false,
        references: {
          model: 'urls',
          key: 'id',
        },
      },
      category_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        onDelete: 'cascade',
        onUpdate: 'cascade',
        references: {
          model: 'categories',
          key: 'id',
        },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('url__category');
  },
};
