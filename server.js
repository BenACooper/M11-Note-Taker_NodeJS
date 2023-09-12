const express = require("express");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

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
  fs.readFile(dbPath, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    const notes = JSON.parse(data);
    res.json(notes);
  });
});

// Route to add a new note based on line 36 from index.js
app.post("/api/notes", (req, res) => {
  fs.readFile(dbPath, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    const notes = JSON.parse(data);
    const newNote = req.body;

    // Generate a unique ID for the new note.
    newNote.id = uuidv4();

    notes.push(newNote);

    fs.writeFile(dbPath, JSON.stringify(notes), (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      res.json(newNote);
    });
  });
});

// Route to handle DELETE requests
// Route to delete a note by ID
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
