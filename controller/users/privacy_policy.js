const { users } = require('../../models');

module.exports = {
  get: (req, res) => {
    try {
      res.status(200).send('provacy_policy');
    } catch (err) {
      console.log('privacy_policy err');
      console.log(err);
      res.status(404).send('bad request');
    }
  },
};
