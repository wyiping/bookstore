var log4js = require('log4js');

var fs = require('fs');
// 判断日志目录是否存在，不存在时创建日志目录
if(!fs.existsSync('logs')){
    fs.mkdirSync('logs')
}

// 加载配置文件
log4js.configure({
    "appenders": [  
        {
            "type": "console"
        },  
        {
            type: "dateFile",
            filename: 'logs/',
            pattern: "yyyy-MM-dd.txt", 
            alwaysIncludePattern: true,
            category: "info"
        }
    ],  
    "replaceConsole": true,  
    "levels":{"logInfo": "auto"}  
});

var logInfo = log4js.getLogger('info');

// 配合express用的方法
exports.use = function(app) {
    //页面请求日志, level用auto时,默认级别是WARN
    app.use(log4js.connectLogger(logInfo, {level:'auto'}));
}