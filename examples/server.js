const server = require('http')

server.createServer((req, res) => {
    res.end('yes')
}).listen(1000, () => {
    console.log('\x1b[36m', 'Listening on port:' + 1000);
});