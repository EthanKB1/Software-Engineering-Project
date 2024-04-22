import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import { registerUser, authenticateUser } from './user'; // Import registerUser and authenticateUser functions

const app = express();
const PORT = 3000; // Use the provided port

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes

// Register Page
app.get('/register', function (req, res) {
    res.render('register');
});

// Handle Register Form Submission
app.post('/register', async function (req, res) {
    try {
        // Extract email and password from request body
        const { email, password } = req.body;

        // Call registerUser function to register the user
        await registerUser(email, password);

        // Redirect to login page after successful registration
        res.redirect('/login');
    } catch (error) {
        // Handle error, e.g., display an error message
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// Login Page
app.get('/login', function (req, res) {
    res.render('login');
});

// Handle Login Form Submission
app.post('/login', async function (req, res) {
    try {
        // Extract email and password from request body
        const { email, password } = req.body;

        // Call authenticateUser function to authenticate the user
        const user = await authenticateUser(email, password);

        // If user exists and password is correct, redirect to some other page (e.g., homepage)
        if (user) {
            res.redirect('/'); // Change this to the desired destination
        } else {
            // If user doesn't exist or password is incorrect, render login page with an error message
            res.render('login', { error: 'Invalid email or password' });
        }
    } catch (error) {
        // Handle error, e.g., display an error message
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
}); 