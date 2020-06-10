const { users } = require('../../models')

module.exports = {
  put: (req, res) => {
    const { age, gender } = req.body
    users
      .update(
        {
          age: age,
          gender: gender
        },
        {
          where: {
            id: req.params.user_id
          }
        }
      )
      .then(result => {
        res.status(200).send('프로필 설정 완료')
      })
  }
}
