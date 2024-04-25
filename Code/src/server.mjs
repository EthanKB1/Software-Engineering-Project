import express from "express";
import mysql from "mysql2/promise";
import session from 'express-session';
import DatabaseService from "./services/database.services.mjs";
import User from "./models/user.mjs";

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

// All Cities
app.get("/allCities", async (req, res) => { // Change this route to /cities
    let { sort } = req.query;
    const [rows, fields] = await db.getCities();

    // Sort the cities by population if the query parameter is provided
    if (sort && sort.toLowerCase() === 'desc') {
        rows.sort((a, b) => b.Population - a.Population); // Sort in descending order
    } else if (sort && sort.toLowerCase() === 'asc') {
        rows.sort((a, b) => a.Population - b.Population); // Sort in ascending order
    }

    /* Render cities.pug with data passed as plain object */
    return res.render("cities", { rows, fields });
});

app.get("/allCities/:id", async (req, res) => {
    const cityId = req.params.id;
    const city = await db.getCity(cityId);
    return res.render("city", { city });
});

// Updates a city by ID
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

// Returns JSON array of cities
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

/*
Error with this as the sorting buttons dont work
app.get("/allCountries", async (req, res) => {
    let orderBy = ""; // Default order by clause
    const { sort } = req.query;

    // Check if sort parameter exists and set orderBy accordingly
    if (sort === "asc") {
        orderBy = "ORDER BY Population ASC";
    } else if (sort === "desc") {
        orderBy = "ORDER BY Population DESC";
    }

    // Fetch countries from the database with optional sorting by population
    const [rows, fields] = await db.getCountries(orderBy);

    // Render countries.pug with data passed as plain object
    return res.render("countries", { rows, fields });
});*/

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
        let populationData = await db.getAllPopulation();

        // Sorting logic
        const { sort } = req.query;
        if (sort === 'asc') {
            populationData.sort((a, b) => a.Population - b.Population);
        } else if (sort === 'desc') {
            populationData.sort((a, b) => b.Population - a.Population);
        }

        // Render the population page with population data
        res.render("population", { populationData });
    } catch (error) {
        console.error("Error fetching population data:", error);
        res.status(500).json({ error: "An error occurred while fetching population data." });
    }
});


// Fetch and render populationByContinent view
app.get("/populationByContinents", async (req, res) => {
    try {
        // Fetch continents from the database
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
        // Extract the continent value from the request body
        const { continent } = req.body;

        // Check if continent is provided
        if (!continent) {
            throw new Error("Continent parameter is missing.");
        }

        // Query the database to calculate population by continent
        const populationData = await db.calculatePopulationByContinent(continent);

        // Fetch continents again from the database
        const continents = await db.getContinents();

        // Check if population data is available
        if (!populationData || populationData.length === 0) {
            throw new Error("No population data available for the selected continent.");
        }

        // Render the population data with continents data
        res.render("populationByContinent", { populationData, continents });
    } catch (error) {
        console.error("Error handling population by continent:", error);
        // If there's an error, render the template with an empty populationData array and error message
        res.status(500).render("populationByContinent", { populationData: [], error: error.message });
    }
});


// Fetch and render populationByRegions view
app.get("/populationByRegions", async (req, res) => {
    try {
        // Fetch regions from the database
        const regions = await db.getRegions();
        // Render the populationByRegions template with the region data
        res.render("populationByRegion", { regions });
    } catch (error) {
        console.error("Error fetching region data:", error);
        res.status(500).json({ error: "An error occurred while fetching region data." });
    }
});

// Handle form submission for Population by Regions
app.post("/region", async (req, res) => {
    try {
        // Extract the region value from the request body
        const { region } = req.body;

        // Fetch regions from the database
        const regions = await db.getRegions();

        // Check if region is provided
        if (!region) {
            throw new Error("Region parameter is missing.");
        }

        // Query the database to calculate population by region
        const populationData = await db.calculatePopulationByRegion(region);

        // Check if population data is available
        if (!populationData || populationData.length === 0) {
            throw new Error("No population data available for the selected region.");
        }

        // Render the population data
        res.render("populationByRegion", { regions, populationData });
    } catch (error) {
        console.error("Error handling population by region:", error);
        // If there's an error, render the template with an empty populationData array and error message
        res.status(500).render("populationByRegion", { regions: [], populationData: [], error: error.message });
    }
});


// Fetch and render populationByDistrict view
app.get("/populationByDistricts", async (req, res) => {
    try {
        // Fetch districts from the database
        const districts = await db.getDistricts();
        // Render the populationByDistrict template with the district data
        res.render("populationByDistrict", { districts });
    } catch (error) {
        console.error("Error fetching district data:", error);
        res.status(500).json({ error: "An error occurred while fetching district data." });
    }
});


// Handle form submission for Population by District
app.post("/district", async (req, res) => {
    try {
        // Extract the district value from the request body
        const { district } = req.body;

        // Check if district is provided
        if (!district) {
            throw new Error("District parameter is missing.");
        }

        // Query the database to calculate population by district
        const populationData = await db.calculatePopulationByDistrict(district);

        // Fetch districts from the database (to reload the drop-down menu)
        const districts = await db.getDistricts();

        // Check if population data is available
        if (!populationData || populationData.length === 0) {
            throw new Error("No population data available for the selected district.");
        }

        // Render the population data along with the districts data
        res.render("populationByDistrict", { populationData, districts });
    } catch (error) {
        console.error("Error handling population by district:", error);
        // If there's an error, render the template with an empty populationData array, districts, and error message
        res.status(500).render("populationByDistrict", { populationData: [], districts: [], error: error.message });
    }
});


//-----
// Set up session middleware
app.use(session({
    secret: 'secretkeysdfjsflyoifasd',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
  }));
  
  // Body Parser Middleware
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  
  // Register route handler
  app.get("/register", (req, res) => {
      res.render("register");
  });
  
  // Login route handler
  app.get("/login", (req, res) => {
      res.render("login");
  });
  
  // Route to handle user authentication
  app.post('/authenticate', function (req, res) {
    const params = req.body;
    const user = new User(params.email);
    try {
      user.getIdFromEmail().then(uId => {
        if (uId) {
          user.authenticate(params.password).then(match => {
            if (match) {
              // Set session for the user
              req.session.uid = uId;
              req.session.loggedIn = true;
              res.redirect('/single-student/' + uId);
            } else {
              // Handle invalid password
              res.send('Invalid password');
            }
          }).catch(error => {
            console.error(`Error authenticating user: `, error.message);
            res.status(500).send('Internal Server Error');
          });
        } else {
          // Handle invalid email
          res.send('Invalid email');
        }
      }).catch(error => {
        console.error(`Error getting user ID from email: `, error.message);
        res.status(500).send('Internal Server Error');
      });
    } catch (err) {
      console.error(`Error while comparing `, err.message);
      res.status(500).send('Internal Server Error');
    }
  });
  
  // Route to test session
  app.get("/", function(req, res) {
    console.log(req.session);
    if (req.session.uid) {
      res.send('Welcome back, ' + req.session.uid + '!');
    } else {
      res.send('Please login to view this page!');
    }
    res.end();
  });
  
  // Route to handle logout
  app.get('/logout', function (req, res) {
    req.session.destroy();
    res.redirect('/login');
  });
  
  // Export the app for use in other modules
  module.exports = app;

//------

// Account
app.get("/account", async (req, res) => {
    const { auth, userId } = req.session;

    if (!auth) {
        return res.redirect("/login");
    }

    const sql = `SELECT id, email FROM user WHERE user.id = ${userId}`;
    const [results, cols] = await conn.execute(sql);
    const user = results[0];

    res.render("account", { user });
});

app.post("/api/register", async (req, res) => {
    const { email, password } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    try {
        const sql = `INSERT INTO user (email, password) VALUES ('${email}', '${hashed}')`;
        const [result, _] = await conn.execute(sql);
        const id = result.insertId;
        req.session.auth = true;
        req.session.userId = id;
        return res.redirect("/account");
    } catch (err) {
        console.error(err);
        return res.status(400).send(err.sqlMessage);
    }
});

app.post("/api/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(401).send("Missing credentials");
    }

    const sql = `SELECT id, password FROM user WHERE email = '${email}'`;
    const [results, cols] = await conn.execute(sql);

    const user = results[0];

    if (!user) {
        return res.status(401).send("User does not exist");
    }

    const { id } = user;
    const hash = user?.password;
    const match = await bcrypt.compare(password, hash);

    if (!match) {
        return res.status(401).send("Invalid password");
    }

    req.session.auth = true;
    req.session.userId = id;

    return res.redirect("/account");
});





app.listen(port, () => {
    console.log('Server ready!');
    console.log('The port is: ' + port);
});
