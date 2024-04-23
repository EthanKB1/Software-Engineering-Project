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

  // Get an existing user id from an email address, or return false if not found
  async getIdFromEmail() {
    try {
      // Use the method from db to fetch user ID by email
      const user = await db.getUserByEmail(this.email);
      // If user found, return the ID
      if (user) {
        return user.id;
      } else {
        return false; // User not found
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