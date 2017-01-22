var settings=require('./js/settings.js');
var http=require('http');
var static=require('node-static');
var fileServer=new static.Server('.');
var port=5534;
var s=new settings('./test.txt');
http.createServer(function(request,response)
{
	if(request.url==='/')
	{
		
	}
	else if(request.url==='/query/')
	{
		
	}
	else
		fileServer.serve(request,response);
}).listen(port);
console.log('Open http://127.0.0.1:'+port+'/ to change settings and see progress.');

console.log('>',s.getAccountsList(console.log.bind(console,'<')));