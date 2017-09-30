"use strict";

const express = require("express");
const router = express.Router();
const cookieSession = require("cookie-session");
const bcrypt = require('bcrypt');

const chooseCategories = require("../getCategory");

module.exports = knex => {
  const User = require("../lib/user")(knex);

  router.get("/items", (req, res) => {
    knex
      .select("*")
      .from("items")
      .then(results => {
        res.json(results);
      });
  });

  // ADD ITEMS
  router.post("/items/add", (req, res) => {
    const item = req.body.input;
    chooseCategories(item).then(result => {
      if (Array.isArray(result) && result.length !== 1) {
        res.send(JSON.stringify(result));
      } else {
        if (Array.isArray(result)) {
          result = result[0];
        }
        knex.insert({content: item, user_id: '1', category: result, status: true}).into('items')
          .then(res.send(JSON.stringify('success')));
      }
    });
  });

  router.post("/items/add/direct", (req, res) => {
    const item = req.body.input;
    const category = req.body.category;
    knex.insert({content: item, user_id: '1', category: category, status: true}).into('items')
          .then(res.send(JSON.stringify('success')));
  });

  // LOGIN -- need to link to login button in navbar
  router.get("/login", (req, res) => {
    let user = req.session.id;
    if (user) {
      res.redirect("/");
    } else {
      res.render("_login");
    }
  });

  // LOGIN HANDLER
  router.post("/login", (req, res) => {
    const email = req.body.email;
    const pw = req.body.password;

    User.authenticate(email, pw).then(user => {
      req.session.id = user.email;
      res.redirect("/");
    });
  });

  // UPDATE EMAIL & PASSWORD
  router.post("/profile", (req, res) => {
    const email = req.body.email;
    const pw = req.body.password;

    User.updateUser(email, pw).then((result) => {
      let id = result[0];
      req.session.user_id = id;
      res.redirect("/");
    })
    .catch((error) => console.log("Update has failed."));
  });

///////////////////////// REGISTER //////////////////////
  router.post("/register", (req, res) => {
    const email = req.body.newEmail;
    // let hashedPassword;
    // hashedPassword = bcrypt.hashSync(req.body.newPassword, 10);
    const pw = req.body.newPassword;
    knex('users')
    .insert({email: email, password: pw})
    .then( () => {
      req.session.id = req.body.newEmail;
      res.redirect("/");
    });
      // );
  });

////////////LOG OUT///////////////
router.post('/logout', (request, response) => {
  console.log('logout goes here');
  request.session.id = null;
  request.session = null;
  console.log("session cookie cleared");
  response.redirect('/');
});

///////////////////////// DELETE ITEMS //////////////////////////
  router.post("/items/delete", (req, res) => {
    let itemToDelete = req.body.itemToDelete;
    knex('items')
    .where('content', itemToDelete).del()
    .then(function(count){
      res.send({result: 'true'});
    });
    // res.redirect('/');
  });

///////////////////////// MOVE ITEMS ////////////////////////
  router.put("/items/move", (req, res) => {
    let itemToMove = req.body.itemToMove;
    let moveToCategory = req.body.moveToCategory;
    knex('items')
    .where('content', itemToMove)
    .update('category', moveToCategory)
    .then(function(){
      res.send({data: 'true'});
    });
  });

  return router;
};
