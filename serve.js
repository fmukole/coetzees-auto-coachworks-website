// Tiny local preview server: node serve.js  ->  http://localhost:8096
const http = require("http"), fs = require("fs"), path = require("path");
const types = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".json": "application/json", ".png": "image/png", ".jpg": "image/jpeg", ".webp": "image/webp", ".svg": "image/svg+xml", ".xml": "application/xml", ".txt": "text/plain" };
http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split("?")[0]); if (p.endsWith("/")) p += "index.html";
  let f = path.join(__dirname, path.normalize(p));
  if (!f.startsWith(__dirname)) { res.writeHead(403); return res.end(); }
  if (!path.extname(f) && fs.existsSync(path.join(f, "index.html"))) { res.writeHead(301, { Location: p + "/" }); return res.end(); }
  fs.readFile(f, (e, d) => {
    if (e) { res.writeHead(404, { "Content-Type": types[".html"] }); return res.end(fs.readFileSync(path.join(__dirname, "404.html"))); }
    res.writeHead(200, { "Content-Type": types[path.extname(f)] || "application/octet-stream", "Cache-Control": "no-store" }); res.end(d); });
}).listen(8096, () => console.log("http://localhost:8096"));
