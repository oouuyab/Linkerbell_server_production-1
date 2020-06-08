'use strict'

const CryptoJS = require('react-native-crypto-js')

module.exports = (sequelize, DataTypes) => {
  const users = sequelize.define(
    'users',
    {
      email: {
        type: DataTypes.STRING,
        allowNull: false
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      age: DataTypes.INTEGER,
      gender: DataTypes.INTEGER
    },
    {
      hooks: {
        beforeCreate: (data, option) => {
          const secretKey = '#_secret!@#%'
          var salt = CryptoJS.lib.WordArray.random(128 / 8)
          var pbk = CryptoJS.PBKDF2(secretKey, salt, { keySize: 512 / 32, iterations: 100000 })
          var encrypt = CryptoJS.AES.encrypt(data.password, pbk)
          data.password = encrypt
        },
        beforeFind: (data, option) => {
          if (data.where.password) {
            const secretKey = '#_secret!@#%'
            var salt = CryptoJS.lib.WordArray.random(128 / 8)
            var pbk = CryptoJS.PBKDF2(secretKey, salt, { keySize: 512 / 32, iterations: 100000 })
            var encrypt = CryptoJS.AES.encrypt(data.where.password, pbk)
            data.where.password = encrypt
          }
        }
      }
    }
  )
  users.associate = function (models) {
    users.hasMany(models.urls, {
      foreignKey: 'user_id',
      sourceKey: 'id'
    })
  }
  return users
}
