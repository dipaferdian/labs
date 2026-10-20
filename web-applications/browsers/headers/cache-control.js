const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 3000;
let requestCount = 0;

const server = http.createServer((req, res) => {
  // Serve the HTML page.
  if (req.url === "/" && req.method === "GET") {
    const filePath = path.join(__dirname, "cache-control.html");

    res.writeHead(200, {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
    });

    fs.createReadStream(filePath).pipe(res);
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host}`);

  // API endpoint with browser caching enabled.
  if (url.pathname === "/api/data" && req.method === "GET") {
    requestCount++;

    const data = {
      message: "Hello from Node.js server!",
      serverTime: new Date().toISOString(),
      serverRequestCount: requestCount,
    };

    res.writeHead(200, {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=60",
    });

    res.end(JSON.stringify(data));
    return;
  }

  // Handle unknown routes.
  res.writeHead(404, {
    "Content-Type": "text/plain; charset=utf-8",
    "Cache-Control": "no-store",
  });

  res.end("404 Not Found");
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
