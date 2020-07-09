'use strict';

const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  const users = sequelize.define(
    'users',
    {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      age: DataTypes.INTEGER,
      gender: DataTypes.INTEGER,
      activate: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      email_token: DataTypes.STRING(1000),
    },
    {
      hooks: {
        beforeCreate: async (data, option) => {
          var salt = bcrypt.genSaltSync(10);
          const hash = await bcrypt.hash(data.password, salt);
          data.password = hash;
        },
      },
    }
  );
  users.associate = function (models) {
    users.hasMany(models.urls, {
      foreignKey: 'user_id',
      sourceKey: 'id',
    });
  };
  return users;
};
