var express = require('express');
let Article = require('../model').Article;
var router = express.Router();
router.get('/add',function(req,res){
    res.render('article/add',{title:'发表文章',doc:{}});
});
router.post('/add',function(req,res){
   let article = req.body;
   //补充作者字段
   article.user = req.session.user._id;
   article.createAt = new Date();
   Article.create(article,function(err,doc){
     if(err){
         req.session.error = '数据库操作失败';
         res.redirect('back');
     }else{
        req.session.success = '文章发表成功';
        res.redirect('/');
     }
   });
});

router.get('/detail/:_id',function(req,res){
  //从路径参数中获取ID
  let _id = req.params._id;
  //从ID中查询文章对象
  Article.findById(_id,function(err,doc){
      if(err){
          req.session.error = '数据查询失败';
          res.redirect('back');
      }else{
          ///使用文章对象渲染文章详情模板
          res.render('article/detail',{title:'文章详情',doc});
      }
  })
});
//文章的删除
router.get('/delete/:_id',function(req,res){
    let _id = req.params._id;
    Article.remove({_id},function(err,result){
        if(err){
            req.session.error = '数据查询失败';
            res.redirect('back');
        }else{
            res.redirect('/');
        }
    });
});
router.get('/update/:_id',function(req,res){
   let _id = req.params._id;
   Article.findById(_id,function(err,doc){
       res.render('article/add',{title:'修改文章',doc});
   })
});
router.post('/update/:_id',function(req,res){
    console.log(req.body);
    let _id = req.params._id;
    Article.update({_id},req.body,function(err,result){
        if(err){
            req.session.error = '数据查询失败';
            res.redirect('back');
        }else{
            res.redirect(`/article/detail/${_id}`);
        }
    })
});
module.exports = router;