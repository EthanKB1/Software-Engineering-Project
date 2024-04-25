// Import necessary modules
const db = require('../services/db');
const bcrypt = require("bcryptjs");

class User {
  // Id of the user
  id;
  // Email of the user
  email;

  constructor(email) {
    this.email = email;
  }

  // Checks to see if the submitted email address exists in the Users table
  async getIdFromEmail() {
    try {
      const sql = "SELECT id FROM Users WHERE email = ?";
      const result = await db.query(sql, [this.email]);

      if (result.length > 0) {
        this.id = result[0].id;
        return this.id;
      } else {
        return false;
      }
    } catch (error) {
      // Handle errors here
      console.error("Error getting user ID from email:", error);
      return false;
    }
  }

  // Set user password securely using bcrypt for an existing user
  async setUserPassword(password) {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const sql = "UPDATE Users SET password = ? WHERE id = ?";
      const result = await db.query(sql, [hashedPassword, this.id]);
      return true;
    } catch (error) {
      // Handle errors here
      console.error("Error setting user password:", error);
      return false;
    }
  }

  // Hash and store password for a new user
  async addUser(password) {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const sql = "INSERT INTO Users (email, password) VALUES (?, ?)";
      const result = await db.query(sql, [this.email, hashedPassword]);
      this.id = result.insertId;
      return true;
    } catch (error) {
      // Handle errors here
      console.error("Error adding user:", error);
      return false;
    }
  }

  // Test a submitted password against a stored password
  async authenticate(submitted) {
    try {
      const sql = "SELECT password FROM Users WHERE id = ?";
      const result = await db.query(sql, [this.id]);

      if (result.length > 0) {
        const match = await bcrypt.compare(submitted, result[0].password);
        return match;
      } else {
        return false;
      }
    } catch (error) {
      // Handle errors here
      console.error("Error authenticating user:", error);
      return false;
    }
  }
}

module.exports = {
  User
};