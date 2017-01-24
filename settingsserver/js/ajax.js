var AJAX={
	_getXmlHttp:function() 
	{
		var xmlHttp=false;
		try 
		{
			xmlHttp=new ActiveXObject("Msxml2.XMLHTTP");
		} 
		catch(e) 
		{
			try 
			{
				xmlHttp=new ActiveXObject("Microsoft.XMLHTTP");
			} 
			catch(E) 
			{
				xmlHttp=false;
			}
		}
		if(!xmlHttp && typeof XMLHttpRequest!=='undefined') 
			xmlHttp=new XMLHttpRequest();
		return xmlHttp;
	},
	send:function(link,parameters,callback)
	{
		var xmlhttp=this._getXmlHttp();
		xmlhttp.onreadystatechange=function()
		{
			if(this.readyState===4)
			{
				try
				{
					if(callback) 
						callback(this.status,xmlhttp.responseText);
				}
				catch(e)
				{
					console.log(this.status);
					console.log(xmlhttp.responseText);
					console.log(e);
				}
			}
		};
		try
		{
			xmlhttp.open('POST',link,true);
			xmlhttp.setRequestHeader('Content-type','application/x-www-form-urlencoded; charset=UTF-8');
			if(parameters)
			{
				if(Array.isArray(parameters)) 
					parameters=parameters.map(encodeURIComponent).join('&');
				else if(typeof parameters!=='string')
				{
					var tmparr=[];
					for(var i in parameters)
					{
						if(parameters.hasOwnProperty(i)) 
							tmparr.push(i+'='+encodeURIComponent(parameters[i]));
					}
					parameters=tmparr.join('&');
				}
				xmlhttp.send(parameters);
			}
			else 
				xmlhttp.send();
		} 
		catch(e)
		{
			console.log(e);
		}
		return xmlhttp;
	}
};
var Ajax={
	ajaxobject:null,
	send:function(parameters,callback)
	{
		if(typeof parameters==='string') parameters=JSON.parse(parameters);
		var postParameters={query:JSON.stringify(parameters)};
		var ajaxobject=Ajax.ajaxobject;
		if(ajaxobject)
		{
			ajaxobject.classList.add('ajax');
			Ajax.ajaxobject=null;
		}
		var ajax=AJAX.send(location.href+'query/',postParameters,function(statusCode,responseText)
		{
			if(statusCode===200)
			{
				var responseObject=null;
				try
				{
					responseObject=JSON.parse(responseText.replace(/\/\*([^]*)?\*\//g,''));
				}
				catch(e)
				{
					console.log(e);
				}
				if(responseObject!==null)
				{
					if(ajaxobject) ajaxobject.classList.remove('ajax');
					if(responseObject.status==='ok')
					{
						try
						{
							if(callback) callback(responseObject);
						}
						catch(e)
						{
							console.log(e);
						}
					}
				} 
			}
		});
		return {ajax:ajax,object:ajaxobject};
	},
	sendform:function(form,callback)
	{
		if(!form) return;
		var query={};
		var elements=Array.prototype.slice.call(form.elements);
		var lastSubmit=null;
		elements.forEach(function(currentValue,index,array)
		{
			if(currentValue.type==='submit' && currentValue.value!=='') lastSubmit=currentValue;
			if(currentValue.name)
			{
				if(currentValue.type==='checkbox' || currentValue.type==='radio')
				{
					if(currentValue.checked) query[currentValue.name]=currentValue.value.trim();
				}
				else if(currentValue.type==='file'){}
				else
				{
					if(currentValue.name.substr(-2)==='[]')
					{
						var value='';
						if(currentValue.getAttribute('dataObject'))
						{
							try
							{
								value=JSON.parse(currentValue.value.trim());
							}
							catch(e)
							{
								console.log(e);
							}
						}
						else 
							value=currentValue.value.trim();
						if(Array.isArray(query[currentValue.name]))
							query[currentValue.name].push(value);
						else
							query[currentValue.name]=[value];
					}
					else
						query[currentValue.name]=currentValue.value.trim();
				}	
			}
		});
		if(!lastSubmit)
		{
			var elements=form.getElementsByClassName('submit');
			lastSubmit=elements&&elements[0];
		}
		if(!Ajax.ajaxobject) Ajax.ajaxobject=lastSubmit;
		Ajax.send(query,callback);
	}
};