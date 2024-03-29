import express from "express";
import mysql from "mysql2/promise";
import DatabaseService from "./services/database.services.mjs";

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

//Returns JSON array of cities
app.get("/api/allCities", async (req, res) => {
    const [rows, fields] = await db.getCities();
    return res.send(rows);
});

//All Countries
app.get("/allCountries", async (req, res) => {
    const [rows, fields] = await db.getCountries();
    return res.render("countries", { rows, fields });
});

app.get("/allCountries/:id", async (req, res) => {
    const countryCode = req.params.id;
    const country = await db.getCountry(countryCode);
    return res.render("country", { country });
});

app.post("/allCountries/:id", async (req, res) => {
    const countryCode = req.params.id;
    const { name } = req.body;
    const sql = `
    UPDATE country
    SET Name = '${name}'
    WHERE Code = '${countryCode}'; // Changed ID to Code
  `;
    await conn.execute(sql);
    return res.redirect(`/countries/${countryCode}`); // Changed countries to countries
});

//All countryLang
app.get("/allLanguages", async (req, res) => {
    const [rows, fields] = await db.getLanguages();
    return res.render("languages", {rows, fields});
});

app.get("/allLanguages/:id", async (req, res) => {
    const Language = req.params.id;
    const language = await db.getLanguages(Language);
    return res.render("language", { Language });
});

app.post("/allLanguages/:id", async (req, res) =>  {
    const Language = req.params.id;
    const { name } = req.body;
    const sql = `
    UPDATE countryLanguage
    SET Name = '${name}'
    WHERE ID = '${Language}';
  `;
    await conn.execute(sql);
    return res.redirect(`/languages/${Language}`);
});

app.listen(port, () => {
    console.log('Server ready!');
    console.log('The port is: ' + port);
});
