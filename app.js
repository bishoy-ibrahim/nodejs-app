const http = require('http');

const PORT = process.env.PORT || 8080;

const server = http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end(`
    <html>
      <body style="font-family: Arial; text-align: center; margin-top: 100px;">
        <h1>🚀 Hello from Node.js!</h1>
        <p>Running on OpenShift via Tekton CI/CD</p>
        <p>Version: 1.0.0</p>
      </body>
    </html>
  `);
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
