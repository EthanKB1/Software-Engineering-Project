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

    /* Get a list of countries 
    async getCountries() {
        try {
            // Fetch countries from database
            const sql = `SELECT * FROM country`;
            const [rows, fields] = await this.conn.execute(sql);
            const countries = rows.map(c => new Country(c.code, c.name, c.continent, c.country, c.region, c.surfaceArea, c.indepYear, c.population, c.lifeExpectancy, c.GNP, c.GNPOId, c.localName, c.governmentForm, c.headOfState, c.capital, c.code2));
            return countries;
        } catch (err) {
            // Handle error...
            console.error(err);
            return undefined;
        }
    }*/

    /* Get a list of countries */
    async getCountries() {
        try {
            // Fetch cities from database
            const data = await this.conn.execute("SELECT * FROM `country`");
            return data;
        } catch (err) {
            // Handle error...
            console.error(err);
            return undefined;
        }
    }

    /* Get a list of country languages 
    async getLanguages() {
        try {
            // Fetch languages from database
            const sql = `SELECT * FROM countrylanguage`;
            const [rows, fields] = await this.conn.execute(sql);
            const languages = rows.map(c => new CountryLanguage(c.countrycode, c.language, c.isOfficial, c.percentage));
            return languages;
        } catch (err) {
            // Handle error...
            console.error(err);
            return undefined;
        }
    } */

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

    /* Calculate population based on selected parameters */
    async getPopulation(region, continent, country) {
        let population = 0;
        try {
            // Query the database to get population data based on selected parameters
            const [rows, fields] = await this.conn.execute(`
                SELECT SUM(city.Population) AS Population
                FROM city
                INNER JOIN country ON country.Code = city.CountryCode
                WHERE country.Region = ? AND country.Continent = ? AND country.Name = ?
            `, [region, continent, country]);
            
            // Extract population from result
            population = rows[0].Population;
        } catch (error) {
            console.error("Error calculating population:", error);
        }
        return population;
    }
}
