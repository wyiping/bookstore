var app = require('./my_modules/app')
var check = require('./my_modules/check')

// 首页路由
app.use('',require('./routes/shop/user'))

// 管理员路由
app.use('/admin', require('./routes/admin'))
app.use('/admin/user', check, require('./routes/admin/user'))
app.use('/admin/book', check, require('./routes/admin/book'))

// 监听端口
app.listen(2000, () => console.log('服务启动成功，端口2000.'))