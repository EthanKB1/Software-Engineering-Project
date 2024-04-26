// Import necessary modules
import db from '../services/database.services.mjs';
import bcrypt from "bcryptjs";

export class User {
  id;
  email;

  constructor(email) {
    this.email = email;
  }

  async getIdFromEmail() {
    try {
      const sql = "SELECT id FROM users WHERE email = ?";
      const result = await db.query(sql, [this.email]);

      if (result.length > 0) {
        this.id = result[0].id;
        return this.id;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Error getting user ID from email:", error);
      return false;
    }
  }

  async setUserPassword(password) {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const sql = "UPDATE Users SET password = ? WHERE id = ?";
      const result = await db.query(sql, [hashedPassword, this.id]);
      return true;
    } catch (error) {
      console.error("Error setting user password:", error);
      return false;
    }
  }

  async addUser(password) {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const sql = "INSERT INTO Users (email, password) VALUES (?, ?)";
      const result = await db.query(sql, [this.email, hashedPassword]);
      this.id = result.insertId;
      return true;
    } catch (error) {
      console.error("Error adding user:", error);
      return false;
    }
  }

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
      console.error("Error authenticating user:", error);
      return false;
    }
  }
}