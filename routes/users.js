"use strict";

<<<<<<< HEAD
const express = require('express');
const router  = express.Router();
=======
const express = require("express");
const router = express.Router();
const cookieSession = require("cookie-session");
const bcrypt = require("bcrypt");
>>>>>>> development

module.exports = (knex) => {

<<<<<<< HEAD
  router.get("/", (req, res) => {
    knex
      .select("*")
      .from("users")
      .then((results) => {
        res.json(results);
    });
=======
module.exports = knex => {
  const User = require("../lib/user")(knex);

  /////////////////// RENDER ITEMS //////////////////////
  router.get("/items", (req, res) => {
    if (req.session.id !== undefined && req.session.id !== null) {
      knex
        .select('items.id', 'items.user_id', 'items.category', 'items.content', 'items.status', 'users.email')
        .from('items')
        .innerJoin('users', 'items.user_id', 'users.id')
        .where('user_id', req.session.id)
        .then(results => {
          res.json(results);
        });
    }
  });

  /////////////////////// ADD ITEMS ////////////////////////
  router.post("/items/add", (req, res) => {
    const item = req.body.input;
    chooseCategories(item).then(result => {
      if (Array.isArray(result) && result.length !== 1) {
        res.send(JSON.stringify(result));
      } else {
        if (Array.isArray(result)) {
          result = result[0];
        }
        knex
          .insert({
            content: item,
            user_id: req.session.id,
            category: result,
            status: true
          })
          .into("items")
          .then(res.send(JSON.stringify("success")));
      }
    });
  });

  // UPDATE ITEM STATUS
  router.post("/items/update", (req, res) => {
    knex("items")
      .where("id", req.body.itemId)
      .update("status", req.body.status)
      .then();
  });


  router.post("/items/add/direct", (req, res) => {
    const item = req.body.input;
    const category = req.body.category;
    knex
      .insert({ content: item, user_id: req.session.id, category: category, status: true })
      .into("items")
      .then(res.send(JSON.stringify("success")));
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

    User.authenticate(email, pw)
    .then(user => {
      if (!user){
        res.send(JSON.stringify('invalid'));
      } else {
        req.session.email = user.email;
        req.session.id = user.id;
        res.send(JSON.stringify('valid'));
      }
    });
  });

  // UPDATE EMAIL & PASSWORD
  router.post("/profile", (req, res) => {
    const user = req.session.id;
    const pw = req.body.newpassword;
    let hashedPassword = bcrypt.hashSync(pw, 10);

    knex("users")
      .where("email", user)
      .update({
        password: hashedPassword
      })
      .then(count => {
        res.redirect("/");
      });
  });

  ///////////////////////// REGISTER //////////////////////
  router.post("/register", (req, res) => {
    const email = req.body.email;
    const pw = req.body.password;
    User.findEmail(email)
    .then(user => {
      if(!user){

        let hashedPassword = bcrypt.hashSync(pw, 10);
        knex("users")
        .returning('id')
        .insert({ email: email, password: hashedPassword })
        .then((user) => {
          req.session.email = req.body.email;
          req.session.id = user.toString();
          res.send(JSON.stringify('valid'));
        });
      } else {
        res.send(JSON.stringify('invalid'));
      }
    });
  });

  ////////////LOG OUT///////////////
  router.post("/logout", (request, response) => {
    request.session.id = null;
    request.session = null;
    response.redirect("/");
  });

  ///////////////////////// DELETE ITEMS //////////////////////////
  router.post("/items/delete", (req, res) => {
    let itemToDelete = req.body.itemToDelete;
    knex("items")
      .where("id", itemToDelete)
      .del()
      .then(function (count) {
        res.send({ result: true });
      });
  });

  ///////////////////////// MOVE ITEMS ////////////////////////
  router.put("/items/move", (req, res) => {
    let itemToMove = req.body.itemToMove;
    let moveToCategory = req.body.moveToCategory;
    knex("items")
      .where("id", itemToMove)
      .update("category", moveToCategory)
      .then(function () {
        res.send({ data: "true" });
      });
>>>>>>> development
  });

  return router;
}
