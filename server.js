const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware for parsing JSON data
app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static('public'));