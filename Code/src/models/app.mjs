// app.mjs
import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import session from 'express-session';
import { registerUser, authenticateUser } from './user';

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false
}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.get('/register', function (req, res) {
    res.render('register');
});

app.post('/register', async function (req, res) {
    try {
        const { email, password } = req.body;
        await registerUser(email, password);
        res.redirect('/login');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/login', function (req, res) {
    res.render('login');
});

app.post('/login', async function (req, res) {
    try {
        const { email, password } = req.body;
        const user = await authenticateUser(email, password);
        if (user) {
            req.session.user = user;
            res.redirect('/'); // Redirect to homepage or another page as needed
        } else {
            res.render('login', { error: 'Invalid email or password' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/logout', function (req, res) {
    req.session.destroy();
    res.redirect('/login');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});