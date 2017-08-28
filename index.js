
var express = require("express");
var routes = require('./routes/index.js');
 var path = require('path');
var session = require('express-session');
var MongoStore = require("connect-mongo")(session);
var flash = require('connect-flash');
 var config = require('config-lite');
 var pkg = require('./package');
 var winston = require('winston');
 var expressWinston = require('express-winston');
 var ejs = require("ejs");

var app = express();


app.set('views',path.join(__dirname,'views'));
app.set('view engine','html');
app.engine("html",ejs.renderFile);

app.use(express.static(path.join(__dirname,'public')));

app.use(session({
	name:config.session.key,
	secret:config.session.secret,
	resave:true,
	saveUninitialized:false,
	cookie:{
		maxAge:config.session.maxAge
	},
	store:new MongoStore({
		url:config.mongodb
	})
}));

app.use(flash());

app.use(require('express-formidable')({
	uploadDir:path.join(__dirname,'public/img'),
	keepExtensions:true
}));

app.locals.blog = {
	title:pkg.name,
	decription:pkg.decription
};

app.use(function(req,res,next){
	res.locals.user = req.session.user;
	res.locals.success = req.flash('success').toString();
	res.locals.error = req.flash('error').toString();
	next();
});

// app.use(expressWinston.logger({
// 	transports:[
// 		new winston.transports.Console({
// 			json:true,
// 			colorize:true
// 		}),
// 		new winston.transports.File({
// 			filename:'logs/success.log'
// 		})
// 	]
// }));

routes(app);

// app.use(expressWinston.errorLogger({
// 	transports:[
// 		new winston.transports.Console({
// 			json:true,
// 			colorize:true
// 		}),
// 		new winston.transports.File({
// 			filename:'logs/error.log'
// 		})
// 	]
// }));

app.use(function(err,req,res,next){
	res.render('error.ejs',{error:err});
});


if(module.parent){
	module.exports = app;
}else{
	app.listen(config.port,function(){
		console.log(`${pkg.name} listening on port ${config.port}`);
	});
}