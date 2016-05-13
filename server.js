var express = require('express');
var server = express();
var engines = require('consolidate');

server.set('views',__dirname);
server.engine('html',engines.mustache);
server.set('view engine','html')
server.use(express.static(__dirname));

server.get('/:name',function(req,res){
	res.render('index');
});

server.listen(3000,function(){
	console.log("Listening on localhost:3000");
})

