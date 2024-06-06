const http = require("http");

const pizzaOffers = [
  {
    name: "Pizza Singapura",
    costs: 9,
  },
  {
    name: "Pizza Berlin",
    costs: 8,
  },
];

const server = http.createServer((req, res) => {
  res.setHeader("Content-Type", "text/html");
  if (req.url === "/bestellung") {
    res.write("Bestellung wurde entgegengenommen!<br/><br/>");
    
  } else {
    res.write("Willkommen auf unserer Webseite!<br/><br/>");

    pizzaOffers.forEach((pizza) => {
      res.write(pizza.name + " " + pizza.costs + " Euro<br/>");
    });

    res.write(
      '<form action="/bestellung" method="post" style="margin-top: 20px; padding: 1em; border: 1px solid black"><input placeholder="Bestellung..." type="text" name="bestellung" /><input placeholder="Adresse..."type="text"name="adresse" /><button type="submit">Absenden</button></form>'
    );
  }
  res.end();
});

server.listen(3000, () => {
  console.log("Server läuft auf http://localhost:3000");
});
