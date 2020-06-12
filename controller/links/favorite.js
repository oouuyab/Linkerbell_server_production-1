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
          console.log(`url_id: ${url_id}, favorite: ${favorite} 설정 완료`);
        })
        .then(() => {
          res
            .status(200)
            .end(`url_id: ${url_id}, favorite: ${favorite} 설정 완료`);
        });
    } catch (err) {
      res.status(400).end('bad request');
    }
  },
};
