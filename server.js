const express = require('express');
const app = express();

// parse incoming string or array data
app.use(express.urlencoded({ extended: true }));
// parse incoming JSON data
app.use(express.json());

app.use(express.static('public'));

const { notes } = require('./db/db');
const fs = require('fs');
const path = require('path');


function createNote (body, notesArray) {
    const note = body;
    notesArray.push(note);
    fs.writeFileSync(
        path.join(__dirname, './db/db.json'),
        JSON.stringify({ notes: notesArray }, null, 2)
    );

    return note;
}

function validateNote (note) {
    if (!note.title || typeof note.title !== 'string') {
        return false;
    }
    if (!note.text || typeof note.text !== 'string') {
        return false;
    }

    return true;
}



app.get('/api/notes', (req, res) => {
    res.json(notes);
  });


app.post('/api/notes', (req, res) => {
    // set id based on what the next index of the array will be
  req.body.id = notes.length.toString();

  // if any data in req.body is incorrect, send 400 error back
  if (!validateNote(req.body)) {
    res.status(400).send('The note is not properly formatted.');
  } else {
    // add note to json file and notes array in this function
    const note = createNote(req.body, notes);
    res.json(note);
    }
  });

  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
  });

  app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
  });

app.listen(3001, () => {
    console.log(`API server now on port 3001!`);
  });