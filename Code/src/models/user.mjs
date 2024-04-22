// user.mjs
import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';

// Function to connect to the database
async function connectToDatabase() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'world'
    });
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
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user into the database
    const [result] = await connection.execute('INSERT INTO Users (email, password) VALUES (?, ?)', [email, hashedPassword]);
    
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
    
    // Query the database for the user with the provided email
    const [rows] = await connection.execute('SELECT * FROM Users WHERE email = ?', [email]);

    // If user exists, verify password
    if (rows.length > 0) {
      const user = rows[0];
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (passwordMatch) {
        return user;
      }
    }

    // If user doesn't exist or password is incorrect, return null
    return null;
  } catch (error) {
    console.error('Error authenticating user:', error);
    throw error;
  }
}

export { registerUser, authenticateUser };