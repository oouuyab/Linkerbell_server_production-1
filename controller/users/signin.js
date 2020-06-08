const { users } = require('../../models')

module.exports = {
  post: async (req, res) => {
    const { email, password } = req.body
    var sess = req.session
    await users
      .findOne({
        where: {
          email: email,
          password: password
        }
      })
      .then(result => {
        if (result === null) {
          res.status(401).send('이메일이나 비밀번호가 일치하지 않습니다.')
        } else {
          sess.userid = result.id
          res.status(200).json({
            id: result.id
          })
        }
      })
      .catch(err => {
        res.status(404).send(err)
      })
  }
}
