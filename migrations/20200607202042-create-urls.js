'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('urls', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      user_id: {
        type: Sequelize.INTEGER,
        onDelete: 'cascade',
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      url: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      category_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      favorite: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      isnew: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      og_title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      og_image: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      og_description: {
        type: Sequelize.STRING,
        allowNull: false,
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
    return queryInterface.dropTable('urls');
  },
};
