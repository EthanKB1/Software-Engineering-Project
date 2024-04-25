// Import DatabaseService from database.services.mjs file
import DatabaseService from '../services/database.services.mjs';

// Create a new instance of DatabaseService
const db = new DatabaseService();

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
            const sql = "SELECT id FROM Users WHERE Users.email = ?";
            const result = await db.query(sql, [this.email]);
            // Check if result is not empty
            if (result.length > 0) {
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
                await db.query("UPDATE Users SET password = ? WHERE id = ?", [password, userId]);
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
            await db.query("INSERT INTO Users (email, password) VALUES (?, ?)", [this.email, password]);
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
                const result = await db.query("SELECT password FROM Users WHERE id = ?", [userId]);
                if (result.length > 0) {
                    const storedPassword = result[0].password;
                    // Compare stored password with submitted password
                    return storedPassword === submitted;
                } else {
                    return false; // Unable to retrieve password
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