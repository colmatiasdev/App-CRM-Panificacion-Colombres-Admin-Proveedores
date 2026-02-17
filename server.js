var http = require("http");
var fs = require("fs");
var path = require("path");

var mime = { ".html": "text/html", ".css": "text/css", ".js": "application/javascript", ".json": "application/json", ".ico": "image/x-icon", ".png": "image/png", ".jpg": "image/jpeg", ".svg": "image/svg+xml" };

function serve(req, res) {
  var url = req.url === "/" ? "/index.html" : req.url;
  var file = path.join(__dirname, path.normalize(url).replace(/^(\.\.(\/|\\|$))+/, ""));
  var ext = path.extname(file);
  fs.readFile(file, function (err, data) {
    if (err) {
      res.writeHead(err.code === "ENOENT" ? 404 : 500, { "Content-Type": "text/plain; charset=utf-8" });
      res.end(err.code === "ENOENT" ? "404 Not Found" : "Error");
      return;
    }
    res.writeHead(200, { "Content-Type": mime[ext] || "application/octet-stream" });
    res.end(data);
  });
}

function tryListen(port) {
  var server = http.createServer(serve);
  server.on("error", function (err) {
    if (err.code === "EADDRINUSE") tryListen(port + 1);
    else throw err;
  });
  server.listen(port, function () {
    var url = "http://localhost:" + port;
    console.log("Servidor: " + url);
    if (process.send) process.send({ port: port, url: url });
  });
}

tryListen(parseInt(process.env.PORT, 10) || 8080);
