const { users } = require('../../models');
const fs = require('fs');

module.exports = {
  get: (req, res) => {
    try {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      fs.readFile(
        __dirname + '/../../asset/privacy_policy.html',
        (err, data) => {
          if (err) {
            console.log('privacy_policy fs err');
            console.log(err);
            res.send('err');
          }
          res.status(200).end(data, 'utf-8');
        }
      );
    } catch (err) {
      console.log('privacy_policy err');
      console.log(err);
      res.status(404).send('bad request');
    }
  },
};
