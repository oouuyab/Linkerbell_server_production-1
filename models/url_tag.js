'use strict';

module.exports = (sequelize, DataTypes) => {
  const url_tag = sequelize.define(
    'url_tag',
    {
      url_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      tag_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: 'url_tag',
      freezeTableName: true,
    }
  );
  url_tag.associate = function (models) {
    url_tag.belongsTo(models.urls, {
      foreignKey: 'url_id',
      targetKey: 'id',
      onDelete: 'cascade',
    });
  };

  return url_tag;
};
