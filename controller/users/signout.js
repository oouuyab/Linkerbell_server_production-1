module.exports = {
  post: (req, res) => {
    const sess = req.session
    if (sess.userid) {
      req.session.destroy(err => {
        if (err) {
          console.log(err)
          res.status(400).send('bad request')
        } else {
          res.status(200).send('로그아웃 성공')
        }
      })
    } else {
      res.redirect('/')
    }
  }
}
