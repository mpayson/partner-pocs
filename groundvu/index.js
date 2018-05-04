const http = require('http');
const httpProxy = require('http-proxy');
var fs = require('fs');

var proxy = httpProxy.createProxyServer({});

var server = http.createServer(function(req, res) {
  if(req.url === '/'){
    fs.readFile('index.html',function (err, data){
      res.writeHead(200, {'Content-Type': 'text/html','Content-Length':data.length});
      res.write(data);
      res.end();
    });
  }
  else{
    console.log(req.url);
    proxy.web(req, res, { target: 'http://sftp.ground.vu'});
  }
});

console.log("listening on port 8000")
server.listen(8000);