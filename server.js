var app = require('./my_modules/app')
var check = require('./my_modules/check')
// 管理员路由
app.use('/admin', require('./routes/admin'))
app.use('/admin/user', check, require('./routes/admin/user'))
app.use('/admin/book', check, require('./routes/admin/book'))

// 监听2000端口
app.listen(2000, () => console.log('Server runing at port 2000.'))