const { urls } = require('../../models');
const { checkToken } = require('../../modules');
module.exports = {
  get: (req, res) => {
    const token_info = checkToken(req);
    const { user_id } = token_info;
    urls
      .findAll({
        where: {
          user_id: user_id,
        },
      })
      .then((findUrls) => {
        let urlArr = findUrls.map((el) => {
          const { category_id, isnew } = el.dataValues;
          return { category_id: category_id, isnew: isnew };
        });
        const result = [];
        for (let el of urlArr) {
          let value = {};
          if (result.length === 0) {
            value.category_id = el.category_id;
            if (el.isnew === true) {
              value.isnew = true;
            }
            value.count = 1;
            result.push(value);
          } else {
            for (let i = 0; i < result.length; i++) {
              if (result[i].category_id === el.category_id) {
                result[i].count++;
                if (result[i].isnew === false && el.isnew === true) {
                  result[i].isnew = true;
                }
                break;
              } else if (i === result.length - 1) {
                value.category_id = el.category_id;
                if (el.isnew === true) {
                  value.isnew = true;
                }
                value.count = 1;
                result.push(value);
                break;
              }
            }
          }
        }
        return result;
      })
      .then((result) => {
        return res.status(200).json(result);
      })
      .catch((err) => res.status(404).send(err));
  },
};
