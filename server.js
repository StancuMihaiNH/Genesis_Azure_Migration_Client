const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    createServer((req, res) => {
        const parsedUrl = parse(req.url, true);
        handle(req, res, parsedUrl);
    }).listen(process.env.PORT || 3000, (err) => {
        if (err) throw err;
        console.log("> Ready on http://localhost:3000");
    });
});

// const { createServer } = require("http");

// const port = process.env.PORT || 3000;

// const handleRequest = (req, res) => {
//     if (req.url === '/test') {
//         res.writeHead(200, { 'Content-Type': 'text/plain' });
//         res.end('Success: The server is working correctly!');
//     } else {
//         res.writeHead(404, { 'Content-Type': 'text/plain' });
//         res.end('Not Found');
//     }
// };

// createServer((req, res) => {
//     handleRequest(req, res);
// }).listen(port, (err) => {
//     if (err) throw err;
//     console.log(`> Ready on http://localhost:${port}`);
// });