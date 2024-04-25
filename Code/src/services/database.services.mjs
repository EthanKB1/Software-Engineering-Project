import mysql from "mysql2/promise";
import City from "../models/city.mjs";
import Country from "../models/country.mjs";
import CountryLanguage from "../models/countrylanguage.mjs";

export default class DatabaseService {
    conn;

    constructor(conn) {
        this.conn = conn;
    }

    static async connect() {
        const conn = await mysql.createConnection({
            host: process.env.DATABASE_HOST || "localhost",
            user: "root",
            password: "",
            database: "world",
        });

        return new DatabaseService(conn);
    }

    async query(sql, params) {
        try {
            const [rows, fields] = await this.conn.execute(sql, params);
            return rows;
        } catch (error) {
            console.error("Error executing query:", error);
            throw error;
        }
    }

    async getCities() {
        try {
            const data = await this.query("SELECT * FROM `city`");
            return data;
        } catch (err) {
            console.error("Error fetching cities:", err);
            throw err;
        }
    }

    async getCity(cityId) {
        const sql = `
        SELECT city.*, country.Name AS Country, country.Region, country.Continent, country.Population as CountryPopulation
        FROM city
        INNER JOIN country ON country.Code = city.CountryCode
        WHERE city.ID = ?
        `;
        try {
            const [rows, fields] = await this.query(sql, [cityId]);
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
        } catch (err) {
            console.error("Error fetching city:", err);
            throw err;
        }
    }

    async removeCity(cityId) {
        try {
            const res = await this.query(
                "DELETE FROM city WHERE id = ?",
                [cityId]
            );
            console.log(res);
            return res;
        } catch (err) {
            console.error("Error removing city:", err);
            throw err;
        }
    }

    async getCountries() {
        try {
            const data = await this.query("SELECT * FROM `country`");
            return data;
        } catch (err) {
            console.error("Error fetching countries:", err);
            throw err;
        }
    }

    async getLanguages() {
        try {
            const data = await this.query("SELECT * FROM `countrylanguage`");
            return data;
        } catch (err) {
            console.error("Error fetching languages:", err);
            throw err;
        }
    }

    async getAllPopulation() {
        try {
            const sql = `SELECT country.Name AS Country, country.Population, country.Continent
                     FROM country`;
            const data = await this.query(sql);
            return data;
        } catch (err) {
            console.error("Error fetching population data:", err);
            throw err;
        }
    }

    async calculatePopulationByContinent(continent) {
        try {
            const sql = `
            SELECT continent AS name, SUM(population) AS population
            FROM country
            WHERE continent = ?
            GROUP BY continent;
            `;
            const data = await this.query(sql, [continent]);
            return data;
        } catch (err) {
            console.error("Error calculating population by continent:", err);
            throw err;
        }
    }

    async getContinents() {
        try {
            const sql = `SELECT DISTINCT Continent FROM country`;
            const data = await this.query(sql);
            return data.map(row => row.Continent);
        } catch (err) {
            console.error("Error fetching continents:", err);
            throw err;
        }
    }

    async getRegions() {
        try {
            const sql = `SELECT DISTINCT region FROM country`;
            const data = await this.query(sql);
            return data.map(row => row.region);
        } catch (err) {
            console.error("Error fetching regions:", err);
            throw err;
        }
    }

    async calculatePopulationByRegion(region) {
        try {
            const sql = `
                SELECT region AS name, SUM(population) AS population
                FROM country
                WHERE region = ?
                GROUP BY region;
            `;
            const data = await this.query(sql, [region]);
            return data;
        } catch (err) {
            console.error("Error calculating population by region:", err);
            throw err;
        }
    }

    async getDistricts() {
        try {
            const sql = `SELECT DISTINCT District FROM city`;
            const data = await this.query(sql);
            return data.map(row => row.District);
        } catch (err) {
            console.error("Error fetching districts:", err);
            throw err;
        }
    }

    async calculatePopulationByDistrict(district) {
        try {
            const sql = `
            SELECT city.District AS name, SUM(city.population) AS population
            FROM city
            WHERE city.District = ?
            GROUP BY city.District;
            `;
            const data = await this.query(sql, [district]);
            return data;
        } catch (err) {
            console.error("Error calculating population by district:", err);
            throw err;
        }
    }
}