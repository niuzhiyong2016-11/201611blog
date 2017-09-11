//要求登录前才能访问后面的路由
exports.checkNotLogin = function(req,res,next){
  if(req.session.user){
      req.session.error = '你已经登录过了，请不要重复登录';
      res.redirect('/');
  }else{
      next();
  }
}
//此中间件要求登录后才能继续访问
exports.checkLogin = function(req,res,next){
  if(req.session.user){
      next();
  }else{
      req.session.error = '请页面需要登录后才能访问，请登录';
      res.redirect('/user/login');
  }
}