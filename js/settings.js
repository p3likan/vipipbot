Settings=function(filename)
{
	this.filename=filename;
	var filesCache={};
	var fs=require('fs');
	var toData=function(content)
	{
		if(typeof content==='Buffer')
			return content.toJSON();
		else
			return JSON.parse(content);
	};
	var toContent=function(data)
	{
		return Buffer.from(JSON.stringify(data));
	};
	var readFileSync=function(filename,reload)
	{
		var stat=fs.statSync(filename);
		if(reload || !(filename in filesCache) || filesCache[filename].stat.mtime.getTime()!==stat.mtime.getTime())
			filesCache[filename]={data:toData(fs.readFileSync(filename)),stat:stat};
		return filesCache[filename].data;
	};
	var readFileAsync=function(filename,callback,reload)
	{
		fs.stat(filename,function(error,stat)
		{
			if(error && error.code!=='ENOENT')
				console.log(error);
			else if(error)
				callback();
			else if(!reload && (filename in filesCache) && 
					filesCache[filename].stat.mtime.getTime()===stat.mtime.getTime())
				callback(filesCache[filename].data);
			else
				fs.readFile(filename,function(error,content)
				{
					if(error && error.code!=='ENOENT')
						console.log(error);
					else if(error)
						callback();
					else
					{
						try
						{
							filesCache[filename]={data:toData(content),stat:stat};
						}
						catch(err)
						{
							console.log(err);
							callback();
							return;
						}
						callback(filesCache[filename].data);
					}
				});
		});
	};
	var readFile=function(filename,callback,reload)
	{
		try
		{
			if(!callback)
				return readFileSync(filename,reload);
			else
				readFileAsync(filename,callback,reload);
		}
		catch(error)
		{
			if(('code' in error) && error.code!=='ENOENT')
				console.log(error);
			if(callback)
				callback();
		}
	};
	var writeFileSync=function(filename,data)
	{
		var content=toContent(data);
		fs.writeFileSync(filename,content);
		var stat=fs.statSync(filename);
		if((filename in filesCache) && filesCache[filename].data===data)
			filesCache[filename].stat=stat;
		else
			filesCache[filename]={data:data,stat:stat};
	};
	var writeFileAsync=function(filename,data,callback)
	{
		var content=toContent(data);
		fs.writeFile(filename,content,function(error)
		{
			if(error)
				console.log(error);
			callback();
		});
	};
	var writeFile=function(filename,data,callback)
	{
		try
		{
			if(!callback)
				writeFileSync(filename,data);
			else
				writeFileAsync(filename,data,callback);
		}
		catch(error)
		{
			console.log(error);
			if(callback)
				callback();
		}
	};
	var getData=function(filename,defaultvalue,callback)
	{
		return readFile(filename,callback&&function(data)
		{
			callback(data||defaultvalue);
		})||((!callback)&&defaultvalue);
	};
	this.getAccountsList=function(callback)
	{
		return getData(this.filename,[],callback);
	};
	this.getAccount=function(filename,callback)
	{
		return getData(filename,{},callback);
	};
	this.saveAccount=function(filename,data,callback)
	{
		writeFile(filename,data,callback);
	};
};
module.exports=Settings;