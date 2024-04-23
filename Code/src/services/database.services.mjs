import mysql from "mysql2/promise";
import City from "../models/city.mjs";
import Country from "../models/country.mjs";
import CountryLanguage from "../models/countrylanguage.mjs";

export default class DatabaseService {
    conn;

    constructor(conn) {
        this.conn = conn;
    }

    /* Establish database connection and return the instance */
    static async connect() {
        const conn = await mysql.createConnection({
            host: process.env.DATABASE_HOST || "localhost",
            user: "root",
            password: "",
            database: "world",
        });

        return new DatabaseService(conn);
    }

    /* Get a list of all cities */
    async getCities() {
        try {
            // Fetch cities from database
            const data = await this.conn.execute("SELECT * FROM `city`");
            return data;
        } catch (err) {
            // Handle error...
            console.error(err);
            return undefined;
        }
    }

    /* Get a particular city by ID, including country information */
    async getCity(cityId) {
        const sql = `
        SELECT city.*, country.Name AS Country, country.Region, country.Continent, country.Population as CountryPopulation
        FROM city
        INNER JOIN country ON country.Code = city.CountryCode
        WHERE city.ID = ${cityId}
    `;
        const [rows, fields] = await this.conn.execute(sql);
        /* Get the first result of the query (we're looking up the city by ID, which should be unique) */
        const data = rows[0];
        const city = new City(
            data.id,
            data.name,
            data.countryCode,
            data.district,
            data.population
        );
        const country = new Country(
            data.code,
            data.name,
            data.continent,
            data.country,
            data.region,
            data.surfaceArea,
            data.indepYear,
            data.population,
            data.lifeExpectancy,
            data.GNP,
            data.GNPOId,
            data.localName,
            data.governmentForm,
            data.headOfState,
            data.capital,
            data.code2
        );
        city.country = country;
        return city;
    }

    /* Delete a city by ID */
    async removeCity(cityId) {
        const res = await this.conn.execute(
            `DELETE FROM city WHERE id = ${cityId}`
        );
        console.log(res);
        return res;
    }

    /* Get a list of countries */
    async getCountries() {
        try {
            // Fetch countries from database
            const data = await this.conn.execute("SELECT * FROM `country`");
            return data;
        } catch (err) {
            // Handle error...
            console.error(err);
            return undefined;
        }
    }

    /* Get a list of country languages */
    async getLanguages() {
        try {
            // Fetch cities from database
            const data = await this.conn.execute("SELECT * FROM `countrylanguage`");
            return data;
        } catch (err) {
            // Handle error...
            console.error(err);
            return undefined;
        }
    }

    async getAllPopulation() {
        try {
            // Fetch population data for all countries from the database
            const sql = `SELECT country.Name AS Country, country.Population, country.Continent
                     FROM country`;
            const [rows, fields] = await this.conn.execute(sql);
            return rows;
        } catch (error) {
            console.error("Error fetching population data:", error);
            throw error;
        }
    }

    async calculatePopulationByContinent(continent) {
        try {
            // Validate the continent parameter
            if (!continent) {
                throw new Error("Continent parameter is missing.");
            }
            // Query the database to calculate population by continent
            const sql = `
            SELECT continent AS name, SUM(population) AS population
            FROM country
            WHERE continent = ?
            GROUP BY continent;
        `;
            const [rows, fields] = await this.conn.execute(sql, [continent]);
            return rows; // Ensure that the result is an array of objects with properties 'name' and 'population'
        } catch (error) {
            console.error("Error calculating population by continent:", error);
            throw error; // Propagate the error to the caller
        }
    }

    async getContinents() {
        try {
            // Fetch continents from the database
            const sql = `SELECT DISTINCT Continent FROM country`;
            const [rows, fields] = await this.conn.execute(sql);
            return rows.map(row => row.Continent);
        } catch (error) {
            console.error("Error fetching continents:", error);
            throw error;
        }
    }

    async getRegions() {
        try {
            const sql = `
                SELECT DISTINCT region
                FROM country;
            `;
            const [rows, fields] = await this.conn.execute(sql);
            return rows.map(row => row.region);
        } catch (error) {
            console.error("Error fetching regions:", error);
            throw error;
        }
    }
    
    async calculatePopulationByRegion(region) {
        try {
            // Validate the region parameter
            if (!region) {
                throw new Error("Region parameter is missing.");
            }
            // Query the database to calculate population by region
            const sql = `
                SELECT region AS name, SUM(population) AS population
                FROM country
                WHERE region = ?
                GROUP BY region;
            `;
            const [rows, fields] = await this.conn.execute(sql, [region]);
            return rows; // Ensure that the result is an array of objects with properties 'name' and 'population'
        } catch (error) {
            console.error("Error calculating population by region:", error);
            throw error;
        }
    }
    
 // Define a method to fetch districts from the database
async getDistricts() {
    try {
        // Query to fetch unique districts from the database
        const sql = `
            SELECT DISTINCT District
            FROM city;
        `;
        const [rows, fields] = await this.conn.execute(sql);
        // Extract districts from the result
        const districts = rows.map(row => row.District);
        return districts;
    } catch (error) {
        console.error("Error fetching districts:", error);
        throw error;
    }
}

// Define a method to calculate population by district
async calculatePopulationByDistrict(district) {
    try {
        // Validate the district parameter
        if (!district) {
            throw new Error("District parameter is missing.");
        }
        // Query the database to calculate population by district
        const sql = `
            SELECT city.District AS name, SUM(city.population) AS population
            FROM city
            WHERE city.District = ?
            GROUP BY city.District;
        `;
        const [rows, fields] = await this.conn.execute(sql, [district]);
        return rows;
    } catch (error) {
        console.error("Error calculating population by district:", error);
        throw error;
    }
}
 


}




//Query for group by continent: "SELECT Continent, SUM(Population) FROM country WHERE Continent='Europe' group by Continent;"
