var app = require('./my_modules/app')

// 管理员路由
app.use('/', require('./routes/admin'))

// 监听2000端口
app.listen(2000, () => console.log('Server runing at port 2000.'))