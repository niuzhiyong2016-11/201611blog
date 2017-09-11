var express = require('express');
let User = require('../model').User;
var auth = require('../ware/auth');
let multer = require('multer');
//指定上传的文件的存放路径
let upload = multer({dest:'./public/uploads'});
var router = express.Router();
//注册 当客户端访问 /reg
router.get('/reg',auth.checkNotLogin,function(req,res){
    //渲染模板 第一个参数是模板的相对路径
   // res.locals; {title:'注册',age:10}
   res.render('user/reg',{title:'注册',formUser:req.session.formUser||{}});

});
/**
 * 1.先得到请求体对象req.body
 * 2.保存到数据库里，如果成功跳转到首页，如果失败跳回页
 * 3. 保存数据库
 *     1. 引入mongoose
 *     2. 连接数据库(连接之前一定要先启动数据库)
 *     3. 定义用户模型骨架 UserSchema 规定用户对象的属性名和属性的类型
 *     4. 定义用户模型  User 导出此模型
 */
router.post('/reg',auth.checkNotLogin,upload.single('avatar'),function(req,res){
    let user = req.body;
    //findOne 找到一条就返回，如果找到一条返回找到的文档，如果没找到返回null
    User.findOne({username:user.username},function(err,doc){
        if(err){
            req.session.error = '数据库操作失败';
            res.redirect('back');
        }else {
            if(doc){
                req.session.error = '此用户名已经被占用';
                //把在post请求里填写的user 保存到会话中
                req.session.formUser=user;
                res.redirect('back');
            }else{
                user.avatar = `/uploads/${req.file.filename}`;
                User.create(user).then(function(doc){
                    req.session.success = '注册成功,请登录';
                    res.redirect('/user/login');
                },function(err){
                    req.session.error = '数据库操作失败';
                    res.redirect('back');
                })
            }
        }
    })

   /*User.create(user,function(err,doc){
        if(err){
            res.redirect('back');
        }else{
            res.redirect('/user/login');
        }
   })*/
});
//登录 当客户端访问 /login
router.get('/login',auth.checkNotLogin,function(req,res){
  res.render('user/login',{title:'登录'});
});
router.post('/login',auth.checkNotLogin,function(req,res){
  //先获取请求体
  let user = req.body;
  User.findOne(user,function(err,doc){
      if(err){
        req.session.error = '数据库操作失败';
        res.redirect('back');
      }else{
          if(doc){
              //把数据库里查出来的用户对象写到session中user里
              req.session.user = doc;
              res.redirect('/');
          }else{
              req.session.error = '用户名或密码不正确';
              res.redirect('back');
          }
      }
  });
});
// 退出 当客户端访问 /logout 要求登录后才能退出
router.get('/logout',auth.checkLogin,function(req,res){
    req.session.user = null;
    res.redirect('/user/login');
});


module.exports = router;

/**
 { fieldname: 'avatar',
   originalname: 'avatar.png',
   encoding: '7bit',
   mimetype: 'image/png',
   destination: './public/uploads',
   filename: 'a3a40ba6c95ff76f378b08f137a87e3c',
   path: 'public\\uploads\\a3a40ba6c95ff76f378b08f137a87e3c',
   size: 8771 }
 { username: '9', password: '9', email: '9@9.com' }
 **/