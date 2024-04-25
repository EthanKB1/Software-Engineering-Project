// Get the functions in the db.js file to use
import db from '../services/database.services.mjs';
 
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
      var sql = "SELECT id FROM Users WHERE Users.email = ?";
      const result = await db.query(sql, [this.email]);
      // TODO LOTS OF ERROR CHECKS HERE..
      if (JSON.stringify(result) != '[]') {
        this.id = result[0].id;
        return this.id;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Error getting user ID from email:", error);
      throw error;
    }
  }
 
  // Add a password to an existing user
  async setUserPassword(password) {
    try {
      // Get user ID using email
      const userId = await this.getIdFromEmail();
      // If user found, update password
      if (userId) {
        await db.setUserPassword(userId, password);
        return true; // Password set successfully
      } else {
        return false; // User not found
      }
    } catch (error) {
      console.error("Error setting user password:", error);
      throw error;
    }
  }
 
  // Add a new record to the users table
  async addUser(password) {
    try {
      // Add user with email and password
      await db.addUser(this.email, password);
      return true; // User added successfully
    } catch (error) {
      console.error("Error adding user:", error);
      throw error;
    }
  }
 
  // Test a submitted password against a stored password
  async authenticate(submitted) {
    try {
      // Get user ID using email
      const userId = await this.getIdFromEmail();
      // If user found, check password
      if (userId) {
        const storedPassword = await db.getUserPassword(userId);
        // Compare stored password with submitted password
        if (storedPassword === submitted) {
          return true; // Passwords match, authentication successful
        } else {
          return false; // Passwords don't match
        }
      } else {
        return false; // User not found
      }
    } catch (error) {
      console.error("Error authenticating user:", error);
      throw error;
    }
  }
}
 
export { User };