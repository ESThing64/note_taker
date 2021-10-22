const express = require('express');
const path = require('path');
const fs = require('fs');
const util = require('util');
// the random id generator 
const uuid = require('./helpers/uuid');
const PORT = process.env.PORT || 6112;
const db = require('./db/db.json')
const app = express();
const test = util.promisify(fs.readFile)


// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

//===========================================================================
// ############################ Routes ######################################
//===========================================================================

//  Route for the base urpostl
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'))
});

//  Route for the notes url
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);


//===========================================================================
// ############################ Route Methods ###############################
//===========================================================================

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
  console.log(db)
  
return test("./db/db.json", "utf8").then(data => res.json(JSON.parse(data)))

  // console.info(`${req.method} yeah. the request was recived for the note thing`)
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
   

    res.status(201).json(response);
  } else {
    res.status(500).json("hmmmm That didn't work")
  }


});


//===========================================================================

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);