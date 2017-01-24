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
		var body='';
		request.on('data',function(data)
		{
			body+=data;
		});
		request.on('end',function()
		{
			body=decodeURIComponent(body);
			var requestObject=null;
			try
			{
				requestObject=JSON.parse(body);
				var responseObject=serverLogic(requestObject);
				response.writeHead(200,{'Content-Type':'application/json'});
				response.end(JSON.stringify(responseObject));
			}
			catch(e)
			{
				response.writeHead(400,{'Content-Type':'application/json'});
				response.end(JSON.stringify({status:'error',message:e.toString()}));
			}
		});
	}
	else
		fileServer.serve(request,response);
}).listen(port);
console.log('Open http://127.0.0.1:'+port+'/ to change settings and see progress.');

//console.log('>',s.getAccountsList(console.log.bind(console,'<')));
function serverLogic(requestObject)
{
	var responseObject={};
	if(!('action' in requestObject))
		return responseObject;
	if(requestObject.action==='getaccountslist')
		responseObject={status:'ok'};
	return responseObject;
}