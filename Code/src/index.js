const express = require ('express');
const  index = express ();

const port = process.env.PORT || 3000;

//index.get ('/', (req, res) => res.send('Hello World!'));

// use the PUG templating engine 
index.set ('view engine', 'pug');
index.set('views', './index/views'); // specify the views directory

// Create a route for root

index.get("/", function(req, res) {
    res.render("index");
});
 



index.listen (port, () => {
    console.log('Server ready!');
    console.log('The port  is: ' + port);

});