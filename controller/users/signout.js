module.exports = {
  post: (req, res) => {
    try {
      if (req.cookies.token) {
        res.clearCookie('token', { path: '/' });
        res.status(200).send('로그아웃 성공');
      } else {
        res.redirect('/');
      }
    } catch (err) {
      console.log('signout err');
      console.log(err);
      res.status(400).send('bad request');
    }
  },
};
