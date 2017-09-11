var express = require('express');
var path = require('path');
var app = express();
//当客户访问静态文件的时候，会以public目录的绝对目录加上文件子目录寻找此静态文件，如果能找到则返回，如果找不到则next向下匹配路由
app.use(express.static(path.resolve('public')));
var bodyParser = require('body-parser');

let session = require('express-session');
//connect-mongo可以帮我们把 session存放在数据库里，重启服务器之后也不会丢失
let MongoStore = require('connect-mongo')(session);
//设置模板引擎
app.set('view engine','html');
//设置模板存放目录 render的时候写的是相对于此路径的相对路径
app.set('views',path.resolve('views'));
//设置对于html后缀的模板用ejs方法渲染
app.engine('html',require('ejs').__express);
//引入此中间之后会把请求体查询字符串转成对象挂在req.body上
app.use(bodyParser.urlencoded({extended:true}));
var config = require('./config');
//当使用了此中间件之后会在请求对象上增加属性 req.session
app.use(session({
    secret:'zfpx', //加密的秘钥
    resave:true,//是否重新保存session
    saveUninitialized:true, //保存未初始化的session
    //指定会会话数据的存放位置
    store:new MongoStore({
        url:config.dbUrl
    })
}));
/*app.use(function(req,res,next){
    //闪光 用于往session赋值取值
    //type消息类型 message是消息的内容
    res.flash = function(type,message){
        if(message){//如果message有值表示赋值
            req.session[type] = message;
        }else{//如果message没传表示取值
            let msg = req.session[type];
            req.session[type] = null;
            return msg||'';
        }
    }
    res.error = function(message){
        if(message)
            res.flash('error',message);
        else
            return res.flash('error');
    }
    res.success = function(message){
        res.flash('success',message);
    }
    next();
});*/
app.use(function(req,res,next){
    // locals才是真正渲染模板的对象
    res.locals.error = req.session.error;
    res.locals.success = req.session.success;
    req.session.error = null;
    req.session.success= null;
    //把会话中的user属性取出来赋给res.locals
    res.locals.user = req.session.user;
    next();
});
var index = require('./routes/index');
var user = require('./routes/user');
var article = require('./routes/article');
//当请求路径以/user开头的话，会交由user中间件来处理
app.use('/',index);
app.use('/user',user);
app.use('/article',article);
app.listen(80);