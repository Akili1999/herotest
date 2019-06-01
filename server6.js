// Dependencies
// =============================================================
var express = require("express");
var path = require("path");
const fs = require("fs");
const slug = require("slugify")
// Sets up the Express App
// =============================================================
var app = express();
var PORT = 3000;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Star Wars Characters (DATA)
// =============================================================
let rawdata = fs.readFileSync('characters.json')
let characters = JSON.parse(rawdata)


// Routes
// =============================================================

// Basic route that sends the user first to the AJAX Page
app.get("/", function(req, res) {
  // res.send("Welcome to the Star Wars Page!")
  res.sendFile(path.join(__dirname, "view.html"));
});

// Displays all characters
app.get("/api/characters", function(req, res) {
  return res.json(characters);
});

// Displays a single character, or returns false
app.get("/api/characters/:character", function(req, res) {
  var chosen = req.params.character;
  console.log(chosen);
  chosen = chosen.replace(/\s+/g, "").toLowerCase();

  for (var i = 0; i < characters.length; i++) {
    console.log(chosen, characters[i].name)
    if (chosen === characters[i].name.replace(/\s+/g, "").toLowerCase()) {
      return res.json(characters[i]);
    }
  }

  return res.json(false);
});

// Create New Characters - takes in JSON input
app.post("/api/characters", function(req, res) {
  // req.body hosts is equal to the JSON post sent from the user
  // This works because of our body parsing middleware
  var newcharacter = req.body;
  newcharacter.routeName = slug(newcharacter.name)
  console.log(newcharacter);

  characters.push(newcharacter);

  // We then display the JSON to the users
  res.json(newcharacter);
  let data = JSON.stringify(characters);
  fs.writeFileSync('characters.json', data)
});

// Starts the server to begin listening
// =============================================================
app.listen(PORT, function() {
  console.log("App listening on PORT " + PORT);
});
