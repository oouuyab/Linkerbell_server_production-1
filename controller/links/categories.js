const { urls } = require('../../models');

module.exports = {
  patch: (req, res) => {
    req.body;
    const { url_id, category_id } = req.body;
    console.log(category_id, url_id);
    urls
      .update(
        {
          category_id: category_id,
        },
        {
          where: {
            id: url_id,
          },
        }
      )
      .then((result) => {
        res.status(200).send('category 수정이 완료되었습니다.');
      })
      .catch((err) => {
        res.status(400).send('bad request');
      });
  },
};
