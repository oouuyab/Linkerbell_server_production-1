'use strict';
// alter table urls modify url VARCHAR(1000) ;
// alter table urls modify og_image VARCHAR(1000) ;
module.exports = (sequelize, DataTypes) => {
  const urls = sequelize.define('urls', {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    url: {
      type: DataTypes.STRING(1000),
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
    og_title: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: true,
    },
    og_image: {
      type: DataTypes.STRING(1000),
      allowNull: false,
      defaultValue: true,
    },
    og_description: {
      type: DataTypes.STRING,
      allowNull: false,
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
