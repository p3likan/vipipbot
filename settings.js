var settings=require('./js/settings.js');
var s=new settings('./test.txt');
console.log('>',s.getAccountsList(console.log.bind(console,'<')));