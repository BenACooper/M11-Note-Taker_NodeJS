//TODO Refactor code to implement modular design
//TODO Refactor code to implemenet fsUtils?

const express = require("express");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const { readFromFile, writeToFile, readAndAppend } = require("./helpers/fsUtils") //Plagiarised these utiity functions from the MiniProject. xP 

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware for parsing JSON data
app.use(express.json());

//!!Are return and serve used interchangably?
// Serve static files from the 'public' directory
app.use(express.static("public"));

// Define the API routes because DRY
const dbPath = path.join(__dirname, "./db/db.json");

// Route to get all notes refactored with readFromFile
app.get("/api/notes", (req, res) => {
    readFromFile(dbPath)
      .then(data => {
        const notes = JSON.parse(data);
        res.json(notes);
      })
      .catch(err => {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
      });
  });

// Route to add a new note refactored with redAndAppend 
app.post("/api/notes", (req, res) => {
    const newNote = req.body;
  
    // Generate a unique ID for the new note.
    newNote.id = uuidv4();
  
    readAndAppend(newNote, dbPath)
      .then(() => {
        res.json(newNote);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
      });
  });
  
// Route to handle DELETE requests by ID
app.delete('/api/notes/:id', (req, res) => {
    const noteId = req.params.id;
  
    readAndDelete(dbPath, noteId)
      .then((deletedNoteId) => {
        if (deletedNoteId) {
          res.json({ message: 'Note deleted successfully' });
        } else {
          res.status(404).json({ error: 'Note not found' });
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
      });
  });
  
// Route to serve the 'notes.html' page
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "notes.html"));
});

// Route to serve the 'index.html' page for all other routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is listening on PORT ${PORT}`);
});
