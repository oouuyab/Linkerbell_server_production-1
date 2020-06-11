'use strict';

module.exports = (sequelize, DataTypes) => {
  const urls = sequelize.define('urls', {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    favorite: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isnew: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  });

  urls.associate = function (models) {
    urls.hasMany(models.url_tag, {
      foreignKey: 'url_id',
      sourceKey: 'id',
    });
    urls.belongsTo(models.users, {
      foreignKey: 'user_id',
      targetKey: 'id',
      onDelete: 'cascade',
    });
  };
  return urls;
};
