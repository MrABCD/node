var marked = require('marked');
var Comment = require('../lib/mongo.js').Comment;

Comment.plugin("contentToHtml",{
	afterFind:function(comments){
		return comments.map(function(comment){
			comment.content = marked(comment.content || '');
			return comment;
		});
	}
});

module.exports = {
	// 将comment对象存入数据库
	create:function(comment){
		return Comment.create(comment).exec();
	},
	// 根据用户和留言Id删除某一条留言
	delCommentById:function(commentId,author){
		return Comment.remove({author:author,_id:commentId}).exec();
	},
	// 删除某一文章下所有留言
	delCommentsByPostId:function(postId){
		return Comment.remove({postId:postId}).exec();
	},
	// 根据文章Id获取该文章下所有留言
	getComments:function(postId){
		return Comment.find({postId:postId})
		.populate({path:'author',model:'User'})
		.sort({_id:1})
		.addCreateAt()
		.contentToHtml()
		.exec();
		
	},
	getCommentsCount:function(postId){
		return Comment.count({postId:postId}).exec();
	}
}