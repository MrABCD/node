var express = require('express');
var router = express.Router();
var PostModel = require("../models/posts.js");
var CommentModel = require("../models/comments.js");

var checkLogin = require('../middlewares/check').checkLogin;

router.get('/',function(req,res,next){
	var author = req.query.author;

	PostModel.getPosts(author)
	.then(function(posts){

		res.render('posts.ejs',{
			posts:posts
		});

	})
	.catch(next);
});
/*发表文章*/
router.post('/',checkLogin,function(req,res,next){
	var author = req.session.user._id;
	var title = req.fields.title;
	var content = req.fields.content;
	console.log(req.session.user,"**********myblog");
	try{
		if(!title.length){
			throw new Error("请填写标题");
		}
		if(!content.length){
			throw new Error("请填写内容");
		}

	}catch(e){
		req.flash("error",e.massage);
		return res.redirect("back");
	}

	var post = {
		author:author,
		title:title,
		content:content,
		pv:0
	}

	PostModel.create(post).then(function(result){
		post = result.ops[0];//post是从mongoDB中获取的值
		req.flash("success","发表成功");
		res.redirect(`/posts/${post._id}`);
	}).catch(next);
});
/*获取发表文章页*/
router.get('/create',checkLogin,function(req,res,next){
	res.render("create");
});
/*获取单独一篇的文章页*/
router.get('/:postId',function(req,res,next){
	var postId = req.params.postId;


	 Promise.all([
		PostModel.getPostById(postId),
		CommentModel.getComments(postId),
		PostModel.incPv(postId)
	])
	.then(function(result){
		var post = result[0];
		var comments = result[1];
		// console.log("************************\n");
		// console.log(comments);
		// console.log("************************\n");

		if(!post){
			throw new Error("该文章不存在");
		}
		res.render("post",{
			post:post,
			comments:comments
		});
		
	})
	.catch(next);
});
/*获取某一篇文章的更新文章页*/
router.get('/:postId/edit',checkLogin,function(req,res,next){
	var postId = req.params.postId;
	var author = req.session.user._id;

	PostModel.getRawPostById(postId)
	.then(function(post){
		if(!post){
			throw new Error('该文章不存在');
		}
		if(author.toString() !== post.author._id.toString()){
			throw new Error("权限不足");
		}
		res.render('edit',{post:post});
	})
	.catch(next);
})
/*更新文章*/
router.post('/:postId/edit',checkLogin,function(req,res,next){
	var postId = req.params.postId;
	var author = req.session.user._id;
	var title = req.fields.title;
	var content = req.fields.content;

	PostModel.updatePostById(postId,author,{title:title,content:content})
	.then(function(){
		req.flash('success',"编辑文字成功");
		res.redirect("/posts/${postId}");
	})
	.catch(next);
});
/*删除文章*/
router.get('/:postId/remove',checkLogin,function(req,res,next){
	var postId = req.params.postId;
	var ahthor = req.session.user._id;

	PostModel.delPostById(postId,author)
	.then(function(){
		req.flash('success','删除文章成功');

		res.redirect('/posts');
	})
	.catch(next);
});
/*创建留言*/
router.post('/:postId/comment',checkLogin,function(req,res,next){
	var author = req.session.user._id;
	var postId = req.params.postId;
	var content = req.fields.content;
	var comment= {
		author:author,
		postId:postId,
		content:content
	};
	console.log("创建留言：post /:postId/comment");
	CommentModel.create(comment)
	.then(function(){
		req.flash("success","留言成功");
		res.redirect("back");
	})
	.catch(function(err){
		console.log(err);
		req.flash("error","err");

		next();
	});
});

/*router.get('/:postId/comment/:commentId/remove',checkLogin,function(req,res,next){
	var commentId = req.params.commentId;
	var author = req.session.user._id;

	CommentModel.delCommentById(commentId,author)
	then(function(){
		req.flash("success","删除留言成功");
		res.redirect("back");
	})
	.catch(next);
});*/
router.get('/:postId/comment/:commentId/remove',checkLogin,function(req,res){

});

module.exports = router;