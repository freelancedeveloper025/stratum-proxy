var bodyParser = require('body-parser');
var fs = require('fs');
var user = 'forhadshamim'; // just user name. you need to build your system & after login this would be a user username


const express = require('express');
const app = express();

function removeNullsAndTrim (str) {
    if(typeof str === 'string')
        return str.replace(/\0/g, '').trim();
    else
        return str;
}

app.engine("html", require("dot-emc").init(
    {
        app: app,
        fileExtension:"html"
    }
).__express);
app.use(bodyParser());
app.set("view engine", "html");

app.get('/', (req, res) => res.render('index'));

app.post('/',function(req,res){
	
	
	
	var lport = removeNullsAndTrim(req.body.lport); // Set Local port as default for each user. Like: for forhadshamim 7894 . for shamim 7895 etc ....
	var host = removeNullsAndTrim(req.body.host);
	var port = removeNullsAndTrim(req.body.port);
	var worker = removeNullsAndTrim(req.body.worker);
	var address = removeNullsAndTrim(req.body.address);
	
	fs.writeFile(user+'.js', 'var stratum = require(\'stratum-proxy-any\');\nvar s = stratum.start(\''+user+'\','+lport+',\''+host+'\','+port+',\''+worker+'\',\''+address+'\')\n', function (err) {
	  	if (err) {
			console.error("Error occurred while trying to remove file");
		}
		res.render('index')
    });
});
app.get('/start', function(req,res){
	
	
	
	fs.exists(user+'.js', function(exists) {
		if (exists) {
			'use strict'			
			var cp = require('child_process');
			cp.exec('pm2 start '+user+'.js --name="'+user+'"', function(error, stdout, stderr){
				res.redirect('/');
			});
		}
	});
});
app.get('/restart',function(req,res){
	
	
	
	fs.exists(user+'.js', function(exists) {
		if (exists) {
			'use strict'			
			var cp = require('child_process');
			cp.exec('pm2 restart '+user, function(error, stdout, stderr){
				res.redirect('/');
			});
		}
	});
});
		

app.listen(3000, () => console.log('Example app listening on port 3000'))