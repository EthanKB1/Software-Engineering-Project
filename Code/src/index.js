const express = require ('express');
const  index = express ();
const port = process.env.PORT || 3000;
index.get ('/', (req, res) => res.send('Hello World!'));
index.listen (port, () => {
    console.log('Server ready!');
    console.log('The port  is: ' + port);

});