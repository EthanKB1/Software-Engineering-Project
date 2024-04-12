const mysql = require('mysql2/promise');

// creating a function to connect to the database
async function connectToDatabase() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root', 
      password: '', 
      database: 'world'
    });

    // returns the connection
    return connection;
  } catch (error) {
    console.error('Error connecting to the database:', error);
    throw error;
  }
}

// Example usage:
async function main() {
  try {
    const db = await connectToDatabase();

    // Performs database operations
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

main();

//not finished just yet