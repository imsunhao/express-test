var express = require('express');
var router = express.Router();

var model = require('../models/model');
var User = model.User;
var Article = model.Article;

/* GET users listing. */
router.get('/', function(req, res, next) {
  console.log("访问用户管理！");
});


router.get('/change', function(req, res, next) {
    console.log("访问用户修改！传递参数user");
    User.findOne({username:req.session.user.username},function (err,user) {
        req.user=user;
        next();
    });
},function () {
    next('错误未能找到用户！');
});


router.get('/change/son1', function(req, res, next) {
    res.render('index', { title: 'imsunhao' ,user:req.user});
});

router.get('/change/son2', function(req, res, next) {
    res.render('index', { title: 'imsunhao' ,user:req.user});
});



module.exports = router;
