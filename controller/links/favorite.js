const { urls } = require('../../models');

module.exports = {
  patch: (req, res) => {
    const { url_id, favorite } = req.body;

    try {
      urls
        .update(
          {
            favorite: favorite,
          },
          { where: { id: url_id } }
        )
        .then((result) => {
          res
            .status(200)
            .end(`url_id: ${url_id}, favorite: ${favorite} 설정 완료`);
        });
    } catch (err) {
      console.log('favorite err');
      console.log(err);
      res.status(400).end('bad request');
    }
  },
};
