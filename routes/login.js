const express = require('express');
const router = express.Router();

module.exports = knex => {
  router.get('/', (req, res) => {
    knex
      .select('*')
      .from('users')
      .then(results => {
        res.json(results);
      });
  });

  router.get('/login', (req, res) => {
    if (req.session.user_id) {
      res.redirect('/');
    } else {
      res.render('_login');
    }
  });

  router.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    // for each user in database, if email matches
    // check password
  });

  return router;
};
