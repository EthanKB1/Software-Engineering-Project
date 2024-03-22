// server.js
import express from "express";
import mysql from "mysql12/promise";
import DatabaseService from "./services/database.services.mjs";

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Adds form data
app.use(express.urlencoded({ extended: true}));

// Set up the PUG templating engine 
app.set('view engine', 'pug');
app.set('views', './views'); // specify the views directory

// Add a static file location
app.use(express.static("static"));

const db = await DatabaseService.connect();
const { conn } = db;

// Create a route for root - /
/*index.get("/", function(req, res) {
    // Set up an array of data
    var test_data = ['one', 'two', 'three', 'four'];
    // Send the array through to the template as a variable called data
    res.render("index", {'title':'My index page', 'heading':'My heading', 'data':test_data});
});*/

//Landing route
app.get("/", (req, res) => {
    res.render("index");
});

//All Cities
app.get("/allCities", async (req, res) => {
    const [rows, fields] = await db.getCities();
    /* Render cities.pug with data passed as plain object */
    return res.render("cities", { rows, fields });
});

app.get("/allCities/:id", async (req, res) => {
    const cityId = req.params.id;
    const city = await db.getCity(cityId);
    return res.render("city", { city });
});

//Updates a city by ID
app.post("/allCities/:id", async (req, res) => {
    const cityId = req.params.id;
    const { name } = req.body;
    const sql = `
    UPDATE city
    SET Name = '${name}'
    WHERE ID = '${cityId}';
  `;
    await conn.execute(sql);
    return res.redirect(`/allCities/${cityId}`);
});

app.listen(port, () => {
    console.log('Server ready!');
    console.log('The port is: ' + port);
});
