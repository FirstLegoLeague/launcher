var connect = require('connect');
var serveStatic = require('serve-static');
var port = 1391;
connect().use(serveStatic(__dirname)).listen(port);
console.log('server running on port',port);
console.log('open browser to http://localhost:'+port+'/');