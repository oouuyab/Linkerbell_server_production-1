'use strict'

//const CryptoJS = require('crypto-js')
//const CryptoJS = require('react-native-crypto-js')

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
          const salt = '#_secret!@#%'
          //var salt = CryptoJS.lib.WordArray.random(128 / 8)
          //var pbk = CryptoJS.PBKDF2(data.password, salt, { keySize: 256 / 32, iterations: 100000 })
        },
        beforeFind: (data, option) => {
          console.log('data',data.where.password)
          if (data.where.password) {
            const salt = '#_secret!@#%'
            //var salt = CryptoJS.lib.WordArray.random(128 / 8)
            //var pbk = CryptoJS.PBKDF2(data.where.password, salt, { keySize: 256 / 32, iterations: 100000 })
            //var encrypt = CryptoJS.AES.encrypt(data.defaults.password, pbk);
            //data.where.password = JSON.stringify(pbk)
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
