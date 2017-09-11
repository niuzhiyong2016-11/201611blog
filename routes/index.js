var express = require('express');
let Article = require('../model').Article;
var router = express.Router();
//注册 当客户端访问 /
router.get('/',function(req,res){
    let pageNum = isNaN(req.query.pageNum)?1:parseInt(req.query.pageNum);//取哪一个页数据
    let pageSize =isNaN(req.query.pageSize)?3:parseInt(req.query.pageSize);//取每页的记录数
    var count = Article.count({});//总记录数
    // populate是填充，是把一个属性从外键变成对应集合的文档对象
    var records = Article.find({}).skip(pageSize*(pageNum-1)).limit(pageSize).populate('user');//某一个页的数据
    //两个promise同时开始执行，但要二个都完成之后才调回调
    Promise.all([count,records]).then(function(result){
        let total = result[0];//总记录数
        let docs = result[1];//当前页的记录
        res.render('index',{
            title:'首页',
            docs,
            pageNum,
            pageSize,
            totalPage:Math.ceil(total/pageSize)
        });
    },function(err){
        req.session.error= '数据查询失败';
        res.redirect('back');
    });
   /*//返回集合中的总条数
    Article.count({},function(err,count){
        // populate是填充，是把一个属性从外键变成对应集合的文档对象
        Article.find({}).skip(pageSize*(pageNum-1)).limit(pageSize).populate('user').exec(function(err,docs){
            if(err){
                req.session.error= '数据查询失败';
                res.redirect('back');
            }else{
                //渲染模板 第一个参数是模板的相对路径
                res.render('index',{title:'首页',docs});
            }
        });
    });*/


});

module.exports = router;