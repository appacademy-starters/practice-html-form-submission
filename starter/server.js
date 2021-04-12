const http = require("http");
const fs = require('fs');

function getContentType(fileName) {
  const ext = fileName.split(".")[1];
  switch (ext) {
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "png":
      return "image/png";
    case "css":
      return "text/css";
    default:
      return "text/plain";
  }
}

const Cat = require("./cat");
const Dog = require("./dog");

let cat;
let dog;

const server = http.createServer((req, res) => {
  console.log(`${req.method} ${req.url}`);

  // Serve static assets folder
  if (req.method === "GET" && req.url.startsWith("/assets")) {
    const assetPath = req.url.split("/assets")[1];
    try {
      const resBody = fs.readFileSync("./assets" + assetPath);
      res.statusCode = 200;
      res.setHeader("Content-Type", getContentType(assetPath));
      res.end(resBody);
      return;
    } catch {
      console.error("Cannot find asset", assetPath, "in assets folder");
      res.statusCode = 404;
      res.end();
      return;
    }
  }

  // GET / - Home Page
  if (req.method === "GET" && req.url === "/") {
    console.log("Created cat and dog info:", { cat, dog });
    let resBody = fs.readFileSync("./views/index.html");
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html");
    res.end(resBody);
    return;
  }

  // GET /cat - Cat Form
  if (req.method === "GET" && req.url === "/cat") {
    let resBody = fs.readFileSync("./views/cat-form.html");
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html");
    res.end(resBody);
    return;
  }

  // GET /dog - Dog Form
  if (req.method === "GET" && req.url === "/dog") {
    let resBody = fs.readFileSync("./views/dog-form.html");
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html");
    res.end(resBody);
    return;
  }

  let reqBody = "";
  req.on("data", (data) => {
    reqBody += data;
  });

  // When the request is finished processing the entire body
  req.on("end", () => {
    // Parsing the body of the request
    if (reqBody) {
      req.body = reqBody
        .split("&")
        .map((keyValuePair) => keyValuePair.split("="))
        .map(([key, value]) => [key, value.replace(/\+/g, " ")])
        .map(([key, value]) => [key, decodeURIComponent(value)])
        .reduce((acc, [key, value]) => {
          acc[key] = value;
          return acc;
        }, {});
      console.log(req.body);
    }

    // Send a default response if there is no response sent yet
    res.statusCode = 404;
    res.end("Page Not Found");
    return;
  });
});

const port = 5000;

server.listen(port, () => console.log("Server is listening on port", port));
