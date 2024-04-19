const { User } = require("./models/user");


// Register
app.get('/register', function (req, res) {
    res.render('register');
   });
   // Login
   app.get('/login', function (req, res) {
    res.render('login');
   });
