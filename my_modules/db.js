//导入mongoose模块
const mongoose = require('mongoose')

//设置数据库连接地址
mongoose.connect('mongodb://book:wangyiping@book.61780374.xyz:27017/bookstore')

//连接数据库
var db = mongoose.connection;

// 数据库连接失败的提示
db.on('error', err => console.error('mongodb connection error...', err));
// 数据库连接成功的提示
db.once('open', () => console.log('mongodb connection success...'));

var Schema = mongoose.Schema;

// 用户
var UserSchema = new Schema({
    username: { type: String, unique: true },
    password: String,
    petname: String,
    email: String,
    phone: String,
    address: String,
    isAdmin: Boolean
});
var User = mongoose.model('user', UserSchema);

// 书籍
var BookSchema = new Schema({
    bookName: { type: String, unique: true },
    author: String,
    price: String,
    publisher: String,
    ISBN: String,
    score: Number,
    time: String,
    introduction: String
});
var Book = mongoose.model('book', BookSchema);

// 导出User模块
module.exports = { User, Book };