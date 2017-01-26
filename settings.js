var Settings=require('./js/settings.js');
var http=require('http');
var static=require('node-static');
var fileServer=new static.Server('./settingsserver');
var port=5534;
var settings=new Settings('./test.txt');
http.createServer((request,response)=>
{
	if(request.url==='/')
	{
		fileServer.serve(request,response);
	}
	else if(request.url==='/query/')
	{
		var body='';
		request.on('data',(data)=>
		{
			body+=data;
		});
		request.on('end',()=>
		{
			body=decodeURIComponent(body);
			var requestObject=null;
			try
			{
				requestObject=JSON.parse(body);
				serverLogic(requestObject,(responseObject)=>
				{
					response.writeHead(200,{'Content-Type':'application/json'});
					response.end(JSON.stringify(responseObject));
				});
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
function serverLogic(requestObject,callback)
{
	if(!callback)
		callback=(responseObject)=>responseObject;
	var responseObject={};
	if(!('action' in requestObject))
		return callback(responseObject);
	if(requestObject.action==='getaccountslist')
	{
		responseObject=settings.getAccountsList();
	}
	return callback(responseObject);
}