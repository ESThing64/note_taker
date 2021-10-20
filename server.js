const express = require('express');
const path = require('path');
const fs = require('fs');
const util = require('util');
// the random id generator 
const uuid = require('./helpers/uuid');
const PORT = 6112;
const app = express();


// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//makes the public folder avalible
app.use(express.static('public'));

//  Route for the base url
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

//  Route for the notes url
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);


app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
