import mysql from 'mysql2/promise'; // Import mysql2 library

// Function to connect to the database
async function connectToDatabase() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'world'
    });

    // Return the connection
    return connection;
  } catch (error) {
    console.error('Error connecting to the database:', error);
    throw error;
  }
}

// Function to register a new user
async function registerUser(email, password) {
  try {
    // Connect to the database
    const connection = await connectToDatabase();

    // Insert the new user into the database
    const [result] = await connection.execute('INSERT INTO users (email, password) VALUES (?, ?)', [email, password]);

    // Return the result of the insert operation
    return result;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
}

// Function to authenticate a user
async function authenticateUser(email, password) {
  try {
    // Connect to the database
    const connection = await connectToDatabase();

    // Query the database for the user with the provided email and password
    const [rows] = await connection.execute('SELECT * FROM users WHERE email = ? AND password = ?', [email, password]);

    // Return the user if found, otherwise return null
    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    console.error('Error authenticating user:', error);
    throw error;
  }
}

export { registerUser, authenticateUser };