module.exports = {
  post: (req, res) => {
    if (req.session.id) {
      req.session.destroy((err) => {
        if (err) {
          console.log(err)
          res.status(400).send('bad request')
        } else {
          res.clearCookie('session_id')
          res.clearCookie('token', { path: '/' })
          res.status(200).send('로그아웃 성공')
        }
      })
    } else {
      res.redirect('/')
    }
  }
}
