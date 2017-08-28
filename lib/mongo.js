var moment = require('moment');
var objectIdTotimestamp = require('objectid-to-timestamp');
var config = require('config-lite');
var Mongolass = require('mongolass');
var mongolass = new Mongolass();

mongolass.connect(config.mongodb);


exports.User = mongolass.model('User',{
	name:{type:'string'},
	password:{type:'string'},
	avatar:{type:'string'},
	gender:{type:'string',enum:['m','f','x']},
	bio:{type:'string'}
});

exports.Post = mongolass.model('Post',{
	author:{type:Mongolass.Types.ObjectId},
	title:{type:'string'},
	content:{type:'string'},
	pv:{type:'number'}
});

mongolass.plugin('addCreateAt',{
	afterFind:function(results){
		results.forEach(function(item){
			item.created_at = moment(objectIdTotimestamp(item._id))
			.format('YY-MM-DD HH:mm');
		});

		return results;
	},
	afterFindOne:function(result){
		if(result){
			result.created_at = moment(objectIdTotimestamp(result._id))
			.format('YY-MM-DD HH:mm');
		}
		return result;
	}
})
exports.User.index({name:1},{unique:true}).exec();
exports.Post.index({author:1,_id:-1}).exec();

exports.Comment = mongolass.model('Comment',{
	author:{type:Mongolass.Types.ObjectId},
	content:{type:'string'},
	postId:{type:Mongolass.Types.ObjectId}
});

exports.Comment.index({post:1,_id:1}).exec();
exports.Comment.index({author:1,_id:1}).exec();