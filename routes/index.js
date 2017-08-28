module.exports = function(app){

	// app.get('/',function(req,res){
	// 	res.redirect('/posts');
	// 	res.send("get /");
	// });

	

	//app.use('/signup',require('./signup'));
	//app.use('/signin',require('./signin'));
	//app.use('/signout',require('./signout'));
	//app.use('/posts',require('./posts'));
	app.get("/",function(req,res){
		res.render("index.html");
	});

	app.get("/viewport",function(req,res){
		res.render("viewport.html");
	});

	app.get("/result",function(req,res){
		var json = {
			category:['0', '10', '20', '30', '40', '50', '60', '70', '80'],
			data:[15, -50, -56.5, -46.5, -22.1, -2.5, -27.7, -55.7, -76.5]
		}
		var value = req.query.mykey;
		console.log(value);
		res.json(json);
	});

	


	app.use(function(req,res){
		if(!res.headersSent){
			res.status(404).render('404');
		}
	})
}