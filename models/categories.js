'use strict';

module.exports = (sequelize, DataTypes) => {
  const categories = sequelize.define('categories', {
    category_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
  categories.associate = function (models) {
    categories.belongsToMany(models.urls, {
      through: 'url_category',
      foreignKey: 'category_id',
      targetKey: 'id',
    });
  };
  return categories;
};
