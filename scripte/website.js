const http = require("http");
const fs = require("fs");
const mysql = require("mysql");
const url = require("url");
const formidable = require("formidable");
const path = require("path");

const datenbank = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: null,
  database: "datenservert8",
});

datenbank.connect((err) => {
  if (err) {
    console.error("Datenbankverbindung fehlgeschlagen: " + err.stack);
    return;
  }
  console.log("Datenbankverbindung erfolgreich");
});
const server = http.createServer( (req, res) => {
  if (req.url === "/") {
    fs.readFile("index.html", (err, data) => {
      if (err != null) {
        console.error("Fehler beim Lesen der Datei: " + err.stack);
      } else {
        res.end(data);
      }
    });
  } else if (req.url === "/daten" && req.method === "POST") {
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
      datenbank.query(
        "SELECT * FROM nutzer WHERE nutzername = ? AND pwrd = ?",
        [nutzer, pwrd],
        function (err, result, fields) {
          console.log(result);
          if(result.length == 0){
            console.log("Falsches Passwort du atze");
            res.end("Falsches Passwort du Atze");
          }else{
            console.log("Erfolgreich eingeloggt");
            nutzerinteraktion(nutzer);
            fs.readFile("daten.html", (err, data) => {
              if (err != null) {
                console.error("Fehler beim Lesen der Datei: " + err.stack);
              } else {
                res.end(data);
              }
            });
          }
          
        }
      );
      
    });
  }else if(req.url === "/fileupload" && req.method === "POST"){
    // Handle file upload
    let data = '';
    req.on('data', chunk => {
      data += chunk;
    });
    req.on('end', () => {
      // Parse the multipart/form-data
      const boundary = req.headers['content-type'].split('; ')[1].split('=')[1];
      const parts = data.split(`--${boundary}`);
      
      // Extract file data
      let fileData = parts[2].split('\r\n\r\n')[1] + "\r\n" ;
      for(let i = 2; i < parts.length-1; i++){
        fileData += parts[2].split('\r\n\r\n')[i];
      }
      const zwischendaten = fileData.split('\r\n');
      console.log(zwischendaten.length);
      const filenameMatch = parts[2].match(/filename="(.+?)"/);
      const filename = filenameMatch ? filenameMatch[1] : 'unknown';
      
      // Write file to disk
      fs.writeFile(path.join('D:/webserverdaten/skinie17', filename), fileData, 'binary', err => {
        if (err) {
          console.error('Error saving file:', err);
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('Internal Server Error');
        } else {
          console.log('File uploaded successfully:', filename);
          res.writeHead(200, { 'Content-Type': 'text/plain' });
          res.end('File uploaded successfully');
        }
      });
    });
  }
  
  
});
const port = 3000;
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
function nutzerinteraktion (nutzer){
 console.log("Nutzer -"+ nutzer + "- interagiert mit dem Server"); 
}
function datenspeichern(datei, nutzer){
  fs.writeFile(dateiname+".txt", (err) => {
    if(err != null){
      console.error("Fehler beim Schreiben der Datei: " + err.stack);
    }
  });
}
function dateiherunterladen(nutzer, datei){
  console.log("Datei wird heruntergeladen");
}
function dateienverzeichnisanzeigen(nutzer){
  console.log("Dateien werden angezeigt");
}
