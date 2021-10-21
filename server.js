const express = require('express');
const path = require('path');
const fs = require('fs');
const util = require('util');
// the random id generator 
const uuid = require('./helpers/uuid');
const PORT = process.env.PORT || 3001;
const db = require('./db/db.json')
const app = express();


// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//makes the public folder avalible
app.use(express.static('public'));

//  Route for the base url
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'))
});

//  Route for the notes url
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

//delete request
app.delete("/api/notes/:id", (req, res) => {
  const id = req.params.id
  // console.log(id)

  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
    } else {
      // Convert string into JSON object
      const parsedEdit = JSON.parse(data);
      // console.info(parsedEdit)

      for (let i = 0; i < parsedEdit.length; i++) {
        // console.log(parsedEdit[i])
        if (parsedEdit[i].id == id){
          console.log('Removed', parsedEdit[i])
          parsedEdit.splice(i, 1)
          
          console.log('here is the new array', parsedEdit)

        } 
          
            
      }

     
      // save the new array to the jsonfile
     
      fs.writeFile(
        './db/db.json',
        JSON.stringify(parsedEdit, null, 4),
        (writeErr) =>
          writeErr
            ? console.error(writeErr)
            : console.info('Successfully delete the note!')
      );
    }
  });
 
  

});

//get request for a new note

app.get('/api/notes', (req, res) => {
  res.status(200).json(db)

  console.info(`${req.method} yeah. the request was recived for the note thing`)
})

// post request

app.post('/api/notes', (req, res) => {
  console.info(`${req.method} <---- this should be post, if it isnt you messed up`);

  const { title, text } = req.body;


  if (title && text) {
    const newNote = {
      id: uuid(),
      title,
      text,
     
    };

    //this shows the json i put in the body.
    console.log(req.body)
    console.info(req.rawHeaders);

    //get the existing notes

    fs.readFile('./db/db.json', 'utf8', (err, data) => {
      if (err) {
        console.log("🚀 ~ file: server.js ~ line 62 ~ fs.readFile ~ err", err);
      } else {
        const parsedNotes = JSON.parse(data)
        parsedNotes.push(newNote)
        fs.writeFile(
          './db/db.json',
          JSON.stringify(parsedNotes, null, 4),
          (writeErr) =>
            writeErr
              ? console.error(writeErr)
              : console.info('Your note has been added!')
        )
      }

    })

    const response = {
      status: 'success',
      body: newNote,
    }
    console.log("🚀 ~ file: server.js ~ line 82 ~ app.post ~ response", response)

    res.status(201).json(response);
  } else {
    res.status(500).json("hmmmm That didn't work")
  }


});




app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);