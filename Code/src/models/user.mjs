// Get the functions in the db.js file to use
const db = require('../services/database.services.mjs');

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
    // Implement your logic here using functions from the db module
  }

  // Add a password to an existing user
  async setUserPassword(password) {
    // Implement your logic here using functions from the db module
  }

  // Add a new record to the users table
  async addUser(password) {
    // Implement your logic here using functions from the db module
  }

  // Test a submitted password against a stored password
  async authenticate(submitted) {
    // Implement your logic here using functions from the db module
  }
}

export { User };