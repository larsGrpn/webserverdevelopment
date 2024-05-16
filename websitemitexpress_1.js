const express = require("express");
const mysql = require("mysql");
const busboy = require("connect-busboy");
const path = require("path");
const fs = require("fs-extra");
const formidable = require("formidable");
const router = express.Router();

const app = express();
app.use(busboy());
app.use(express.static(path.join(__dirname, "nutzer")))

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

app.post("/daten", (req, res) => {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk.toString();
    console.log(body);
  });
  req.on("end", () => {
    const formdata = new URLSearchParams(body);
    const nutzer = formdata.get("username");
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
          res.sendFile(__dirname + "/daten.html");
        }
      }
    );
  });
});

app.route("/fileupload").post(function (req, res, next) {

    var fstream;
    req.pipe(req.busboy);
    req.busboy.on('file', function (fieldname, file, filename) {
        console.log("Uploading: " + filename);

        //Path where image will be uploaded
        fstream = fs.createWriteStream(__dirname + '/img/' + filename);
        file.pipe(fstream);
        fstream.on('close', function () {    
            console.log("Upload Finished of " + filename);              
            res.redirect('back');           //where to go next
        });
    });
});

/*router.post("/fileupload", (req, res) => {
    console.log(req.files);
});

module.exports = router;*/

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

function nutzerinteraktion(nutzer) {
  console.log("Nutzer -" + nutzer + "- interagiert mit dem Server");
  return;
}
