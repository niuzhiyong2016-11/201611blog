let mongoose = require('mongoose');
mongoose.Promise = Promise;
let ObjectId = mongoose.Schema.Types.ObjectId;
var config = require('../config');
//连接数据库之前要启动数据库
mongoose.connect(config.dbUrl);
//定义用户的模型骨架
let UserSchema = new mongoose.Schema({
    username:String,//用户名
    password:String,//密码
    avatar:String,//头像
    email:String//邮箱
});
//定义了可以操作数据库的模型

module.exports.User = mongoose.model('User',UserSchema);

//文章的模型
let ArticleSchema = new mongoose.Schema({
    title:String,//标题
    content:String,//内容
    //文章的作者是引用的是User模型对应的集合中的主键
    user:{type:ObjectId,ref:'User'}, //从当前的session中获取
    createAt:Date //创建时间
});
exports.Article = mongoose.model('Article',ArticleSchema);