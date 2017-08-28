var path = require('path');
var assert = require('assert');
var request = require('supertest');
var app = require('../index.js');
var User = require('../lib/mongo.js').User;

var testName1 = 'testName1';
var testName2 = 'nswbmw';

describe('signup',function(){
	describe('POST /signup',function(){
		var agent = request.agent(app);

		beforeEach(function(done){
			User.create({
				name:testName1,
				password:'123456',
				avatar:'',
				gender:'x',
				bio:''
			})
			.exec()
			.then(function(){
				done();
			})
			.catch(done);
		});

		afterEach(function(done){
			User.remove({
				name:{$in:[testName1,testName2]}
			}).exec()
			.then(function(done){
				done();
			})
			.catch(done);
		});

		if("wrong name",function(done){
			agent
				.post('/signup')
				.type('form')
				.attch('avatar',path.join(__dirname,'avatar.png'))
				.field({name:''})
				.redirect()
				.end(function(err,res){
					if(err) return done(err);
					assert(res.text.match(/名字请限制在1-10个字符/));
					done();
				})
		})
	})
})