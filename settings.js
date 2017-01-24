var settings=require('./js/settings.js');
var http=require('http');
var static=require('node-static');
var fileServer=new static.Server('./settingsserver');
var port=5534;
var s=new settings('./test.txt');
http.createServer(function(request,response)
{
	if(request.url==='/')
	{
		fileServer.serve(request,response);
	}
	else if(request.url==='/query/')
	{
		response.writeHead(200,{'Content-Type':'application/json'});
		response.end('{}');
	}
	else
		fileServer.serve(request,response);
}).listen(port);
console.log('Open http://127.0.0.1:'+port+'/ to change settings and see progress.');

//console.log('>',s.getAccountsList(console.log.bind(console,'<')));