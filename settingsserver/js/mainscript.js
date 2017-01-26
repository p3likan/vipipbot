function loadAccounts()
{
	Ajax.send({action:'getaccountslist'},(response)=>
	{
		var list=document.getElementById('accountslist');
		var lineTmp=document.getElementById('accountline');
		if(!list || !lineTmp)
			return;
		lineTmp=lineTmp.content;
		response&&response.forEach((account)=>
		{
			var line=lineTmp.cloneNode(true);
			line.querySelector('login').innerText=account.login;
			list.appendChild(line);
		});
		var line=lineTmp.cloneNode(true);
		line.querySelector('login').innerText='Новый аккаунт';
		list.appendChild(line);
	});
}

window.onload=loadAccounts;