function loadAccounts()
{
	Ajax.send({action:'getaccountslist'},function(response)
	{
		console.log(response);
	});
}

window.onload=loadAccounts;