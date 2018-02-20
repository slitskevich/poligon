var http = require('http');
var fs = require('fs');

var server = http.createServer(function (req, res) {
        fs.createReadStream('./smart.html').pipe(res);
}).listen(3000);
console.log('server running on port 3000');