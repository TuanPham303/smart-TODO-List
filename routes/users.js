"use strict";

const express = require("express");
const router = express.Router();
const cookieSession = require("cookie-session");

module.exports = knex => {
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
    knex
      .insert({ content: item, user_id: "1", category: "read", status: true })
      .into("items")
      .then(res.redirect("/"));
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
    const password = req.body.password;

    knex("users")
      .where("email", email)
      .then(rows => {
        // check if rows.length > 0 if it's empty we need to tell them user doesn't exist
        if (rows.length > 0) {
          return knex("users")
            .where("password", password)
            .andWhere("email", email);
        } else {
          throw new Error("user does not exist");
          res.status(401).send("User Not Found");
        }
      })
      .then(rows => {
        // check if rows.length > 0 if it's empty we need to tell them they got the wrong password
        if (rows.length > 0) {
          req.session.id = rows[0].id;
          res.redirect("/");
        } else {
          throw new Error("password is incorrect");
        }
      })
      .catch(error => {
        res.redirect("/");
        console.log(error.message);
      });
  });

  return router;
};
