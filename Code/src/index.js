const express = require ('express');
const  index = express ();

const port = process.env.PORT || 3000;

//index.get ('/', (req, res) => res.send('Hello World!'));

// use the PUG templating engine 
index.set ('view engine', 'pug');
index.set('views', './views'); // specify the views directory

// Create a route for root - /
index.get("/", function(req, res) {
    // Set up an array of data
    var test_data = ['one', 'two', 'three', 'four'];
    // Send the array through to the template as a variable called data
    res.render("index", {'title':'My index page', 'heading':'My heading', 'data':test_data});
   });
 



index.listen (port, () => {
    console.log('Server ready!');
    console.log('The port  is: ' + port);

});