function loadAccounts()
{
	Ajax.send({action:'getaccountslist'},(response)=>
	{
		var list=document.getElementById('accountslist');
		var lineTmp=document.getElementById('accountline');
		if(!list || !lineTmp)
			return;
		lineTmp=lineTmp.content;
		var activeAccount=null;
		while(list.children.length>0)
		{
			let line=list.removeChild(list.children[0]);
			if(line.classList.contains('active'))
				activeAccount=line.querySelector('login').innerText;
		}
		var appendAccountLine=function(account)
		{
			var line=lineTmp.cloneNode(true);
			line.querySelector('login').innerText=account.login;
			if(account.login===activeAccount || account.setActive)
				line.children[0].classList.add('active');
			list.appendChild(line);
		};
		response&&response.forEach(appendAccountLine);
		appendAccountLine({login:'Новый аккаунт',setActive:activeAccount===null});
	});
}

window.onload=loadAccounts;