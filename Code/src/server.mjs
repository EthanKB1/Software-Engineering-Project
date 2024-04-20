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
    //return res.render("countries");
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
    return res.render("languages", { rows, fields });
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

/*app.get("/allPopulation", async (req, res) => {
    const [rows, fields] = await db.getPopulation();
    return res.render("population", { rows, fields });
});*/

// Route to get population data for all countries
app.get("/allPopulation", async (req, res) => {
    try {
        // Fetch population data for all countries from the database service
        const populationData = await db.getAllPopulation();

        // Render the population page with population data
        res.render("population", { populationData });
    } catch (error) {
        console.error("Error fetching population data:", error);
        res.status(500).json({ error: "An error occurred while fetching population data." });
    }
});

// Route to fetch continents
app.get("/continents", async (req, res) => {
    try {
        // Fetch continent data from the database
        const continents = await db.getContinents();
        // Render the populationByContinent template with the continent data
        res.render("populationByContinent", { continents });
    } catch (error) {
        console.error("Error fetching continent data:", error);
        res.status(500).json({ error: "An error occurred while fetching continent data." });
    }
});



// Handle form submission for Population by Continent
app.post("/continent", async (req, res) => {
    try {
        const { continent } = req.body;
        if (!continent) {
            throw new Error("Continent parameter is missing.");
        }
        // Query the database to calculate population by continent
        const populationData = await db.calculatePopulationByContinent(continent);
        if (!populationData || populationData.length === 0) {
            throw new Error("No population data available for the selected continent.");
        }
        // Render the population data
        res.render("populationByContinent", { populationData }); // Pass populationData to the template
    } catch (error) {
        console.error("Error handling population by continent:", error);
        res.status(500).render("populationByContinent", { populationData: [], error: error.message });
    }
});






app.listen(port, () => {
    console.log('Server ready!');
    console.log('The port is: ' + port);
});
