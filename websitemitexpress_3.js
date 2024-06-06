const express = require("express");
const mysql = require("mysql");
const busboy = require("connect-busboy");
const path = require("path");
const fs = require("fs-extra");
const querystring = require("querystring");
const fileUpload = require("express-fileupload");
const app = express();
const pug = require("pug");
const { read } = require("fs");
let speicher = "";
let nutzer = "";
let dateiennutzer = "";
app.use(fileUpload());
app.use(busboy());
app.use(express.static(path.join(__dirname, "nutzer")));

const port = 3000;

let db = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: null,
  database: "datenservert8",
});

db.connect((err) => {
  if (err) {
    console.error("Datenbankverbindung fehlgeschlagen: " + err.stack);
    return;
  }
  console.log("Datenbankverbindung erfolgreich");
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

function handleData(req, res) {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk.toString();
    console.log(body);
  });
  req.on("end", () => {
    const formdata = new URLSearchParams(body);
    nutzer = formdata.get("username");
    const pwrd = formdata.get("pwrd");
    console.log(nutzer + " " + pwrd);

    db.query(
      "SELECT * FROM nutzer WHERE nutzername = ? AND pwrd = ?",
      [nutzer, pwrd],
      function (err, result, fields) {
        console.log(result);
        if (result.length == 0) {
          console.log("Falsches Passwort du atze");
          res.end("Falsches Passwort du Atze");
        } else {
          console.log("Erfolgreich eingeloggt");
          nutzerinteraktion(nutzer);
          res.sendFile(__dirname + "/mainpage.html");
        }
      }
    );
  });
}

app.post("/fileupload", function (req, res) {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send("Keine Dateien hochgeladen");
  }
  let sampleFile = req.files.file;
  console.log(sampleFile.name);
  sampleFile.mv(
    path.join(__dirname, "/nutzer/", nutzer, "/", sampleFile.name),
    function (err) {
      if (err) {
        return res.status(500).send(err);
      }
      readDirectory(res);
    }
  );
});

function readDirectory(res) {
  let pfad = "./nutzer/" + nutzer;
  fs.readdir(pfad, function (err, files) {
    if (err) {
      console.log("Fehler beim Lesen des Verzeichnisses");
    }
    const compiledFunction = pug.compileFile("./daten.pug");
    res.write(compiledFunction({ nutzer, files }));
    res.end();
  });
}

app.post("/login", handleData);
app.post("/daten", function (req, res) {
  readDirectory(res);
});

app.post("download", function (req, res) {

    const buttonName = req.body.buttonName;
    console.log("Button Name: " + buttonName);
    // Rest of the code
});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

function nutzerinteraktion(nutzer) {
  console.log("Nutzer -" + nutzer + "- interagiert mit dem Server");
  return;
}
