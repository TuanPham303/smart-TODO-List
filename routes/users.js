"use strict";

const express = require("express");
const router = express.Router();
const cookieSession = require("cookie-session");

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
    const item = req.body.item;
    chooseCategories(item).then(result => {
      console.log(result);

      if (Array.isArray(result)) {
        if (result.length === 1) {
          result = result[0];
        } else {
          //ask user for input
        }
      }

      knex
        .insert({ content: item, user_id: "1", category: result, status: true })
        .into("items")
        .then(res.redirect("/"));
    });
  });

  // UPDATE ITEM STATUS
  router.post("/items/update", (req, res) => {
    knex("items")
      .where("content", req.body.item)
      .update("status", req.body.status);
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
      req.session.id = user.id;
      res.redirect("/");
    });
  });

  ///////////////////////// DELETE ITEMS //////////////////////////
  router.post("/items/delete", (req, res) => {
    let itemToDelete = req.body.itemToDelete;
    knex("items")
      .where("content", itemToDelete)
      .del()
      .then(function(count) {
        res.send({ result: "true" });
      });
    // res.redirect('/');
  });

  ///////////////////////// MOVE ITEMS ////////////////////////
  router.put("/items/move", (req, res) => {
    let itemToMove = req.body.itemToMove;
    let moveToCategory = req.body.moveToCategory;
    knex("items")
      .where("content", itemToMove)
      .update("category", moveToCategory)
      .then(function() {
        res.send({ data: "true" });
      });
  });

  return router;
};
