'use strict';

module.exports = (sequelize, DataTypes) => {
  const url_category = sequelize.define('url_category', {
    url_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });
  url_category.associate = function (models) {
    url_category.belongsTo(models.urls, {
      foreignKey: 'url_id',
      targetKey: 'id',
      onDelete: 'cascade',
    });
    url_category.belongsTo(models.categories, {
      foreignKey: 'category_id',
      targetKey: 'id',
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });
  };
  return url_category;
};
