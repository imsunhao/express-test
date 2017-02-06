/*****************************************************************************/
/*
 /* 完善注释 2017-02-05 12:59:24   author:imsunhao
 /*
 /*****************************************************************************/

/*****************************************************************************/
/*
 /* 启用文件系统模块
 /*     功能                       文件系统            核心
 /*
 */
var fs = require('fs');
/*
 /*****************************************************************************/


/*****************************************************************************/
/*
 /* 引入文件系统-路径模块
 /*     功能            被           所有文件系统            依赖
 /*
 */
var path = require('path');
/*
 /*****************************************************************************/


/*****************************************************************************/
/*
 /* 启用express框架
 /*     功能            核心框架
 /*     功能            引入父系统 - index
 /*     功能            引入子系统 - 其他
 /*
 */
var express = require('express');
var app = express();

var index = require('./routes/index');                                   //父系统
var users = require('./routes/users');                                   //所有系统的用户管理系统
/*
 /*****************************************************************************/




/*****************************************************************************/
/*
 /* 启用网站请求分析系统-session
 /*     功能            解析与生成    请求中    session
 /*     网址：
 */
var session = require('express-session');
/*
 /*****************************************************************************/

/*****************************************************************************/
/*
 /* 启用网站请求分析系统-cookie
 /*     功能            解析与生成    请求中    cookie
 /*     网址：
 */
var cookieParser = require('cookie-parser');
/*
 /*****************************************************************************/

/*****************************************************************************/
/*
 /* 启用网站请求分析系统-require
 /*     功能            解析    请求中     所有的参数
 /*     网址：
 */
var bodyParser = require('body-parser');
/*
 /*****************************************************************************/

/*****************************************************************************/
/*
 /* 启用网站数据存储系统-mongoose
 /*     功能            数据库     核心
 /*     网址：
 */
var mongoose = require('mongoose');

var MongoStore = require('connect-mongo')(session);                      //提供 session  数据库依赖

mongoose.Promise = global.Promise;

/*
 /*****************************************************************************/


/*****************************************************************************/
/*
 /* 启用网站view engine
 /*     功能            被           所有视图系统            依赖
 /*
 */
app.set('views', path.join(__dirname, 'views'));        //模板根路径
app.set('view engine', 'ejs');                                     //模板为ejs模板
/*
 /*****************************************************************************/


/*****************************************************************************/
/*
 /* 启用 数据库-链接
 /*     功能            被           所有视图系统            依赖
 /*
 */

mongoose.connect('mongodb://localhost:18088/datas');         //本地测试数据库链接

mongoose.connection.on('error', console.error.bind(console, '连接数据库失败'));
/*
 /*****************************************************************************/



/*****************************************************************************/
/*
 /* 启用 express 中间件
 /*     功能           见注释
 /*
 */
app.use(bodyParser.json());                                                         //请求解析 为json格式
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());                                                                //请求解析 cookie
app.use(express.static(path.join(__dirname, 'public')));              //加载public资源
/*
 /*****************************************************************************/


/*session*/
app.use(session({
    key: 'session',
    secret: 'keboard cat',
    cookie: {maxAge: 1000 * 60 * 60 * 24 },//1小时 //1k (s) * 60(min) *60 (hover) *24(day)
    store: new MongoStore({
        db: 'datas',
        mongooseConnection: mongoose.connection
    }),
    resave: false,
    saveUninitialized: true
}));

/*用户使用层*/
app.use('/', index);

/*用户登陆信息层*/
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
