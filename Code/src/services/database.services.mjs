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

    async query(sql, params = []) {
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
            const data = await this.conn.execute("SELECT * FROM `city`");
            return data;
        } catch (err) {
            console.error(err);
            return undefined;
        }
    }

    async getCity(cityId) {
        const sql = `
            SELECT city.*, country.Name AS Country, country.Region, country.Continent, country.Population as CountryPopulation
            FROM city
            INNER JOIN country ON country.Code = city.CountryCode
            WHERE city.ID = ${cityId}
        `;
        const [rows, fields] = await this.conn.execute(sql);
        const data = rows[0];
        return data;
    }

    async removeCity(cityId) {
        const res = await this.conn.execute(`DELETE FROM city WHERE id = ${cityId}`);
        console.log(res);
        return res;
    }

    async getCountries() {
        try {
            const data = await this.conn.execute("SELECT * FROM `country`");
            return data;
        } catch (err) {
            console.error(err);
            return undefined;
        }
    }

    async getLanguages() {
        try {
            const data = await this.conn.execute("SELECT * FROM `countrylanguage`");
            return data;
        } catch (err) {
            console.error(err);
            return undefined;
        }
    }

    async getAllPopulation() {
        try {
            const sql = `SELECT country.Name AS Country, country.Population, country.Continent FROM country`;
            const [rows, fields] = await this.conn.execute(sql);
            return rows;
        } catch (error) {
            console.error("Error fetching population data:", error);
            throw error;
        }
    }

    async calculatePopulationByContinent(continent) {
        try {
            if (!continent) {
                throw new Error("Continent parameter is missing.");
            }
            const sql = `
                SELECT continent AS name, SUM(population) AS population
                FROM country
                WHERE continent = ?
                GROUP BY continent;
            `;
            const [rows, fields] = await this.conn.execute(sql, [continent]);
            return rows;
        } catch (error) {
            console.error("Error calculating population by continent:", error);
            throw error;
        }
    }

    async getContinents() {
        try {
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
            const sql = `SELECT DISTINCT region FROM country;`;
            const [rows, fields] = await this.conn.execute(sql);
            return rows.map(row => row.region);
        } catch (error) {
            console.error("Error fetching regions:", error);
            throw error;
        }
    }

    async calculatePopulationByRegion(region) {
        try {
            if (!region) {
                throw new Error("Region parameter is missing.");
            }
            const sql = `
                SELECT region AS name, SUM(population) AS population
                FROM country
                WHERE region = ?
                GROUP BY region;
            `;
            const [rows, fields] = await this.conn.execute(sql, [region]);
            return rows;
        } catch (error) {
            console.error("Error calculating population by region:", error);
            throw error;
        }
    }

    async getDistricts() {
        try {
            const sql = `
                SELECT DISTINCT District
                FROM city;
            `;
            const [rows, fields] = await this.conn.execute(sql);
            const districts = rows.map(row => row.District);
            return districts;
        } catch (error) {
            console.error("Error fetching districts:", error);
            throw error;
        }
    }

    async calculatePopulationByDistrict(district) {
        try {
            if (!district) {
                throw new Error("District parameter is missing.");
            }
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