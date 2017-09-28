"use strict";

const express = require('express');
const router  = express.Router();

module.exports = (knex) => {

  router.get("/", (req, res) => {
    console.log('asda');
    knex
      .select("*")
      .from("users")
      .then((results) => {
        res.json(results);
    });
  });

// ADD ITEMS
  router.post("/items/add", (req, res) => {
    const item = req.body.item;
    knex('items')
    .insert({name: item})
    .then(res.redirect('/'));
  });

  return router;
};
