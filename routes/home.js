const express = require("express");
const db = require('../my_modules/db');

var router = express.Router();

router.get('', (req, res) => {
    res.render('shop/home.html');
})


router.get('/login', (req, res) => {
    res.render('shop/login.html')
})

router.post('/login', (req, res) => {
    db.User.find({ username: req.body.username }).count((err, count) => {
        if (err) {
            res.json({ code: 0, msg: '系统错误,请重试' })
        } else {
            if (count > 0) {
                db.User.findOne({ username: req.body.username }, (err, data) => {
                    if (req.body.password == data.password) {
                        res.cookie('user', data)
                        res.json({ code: 1, msg: '登录成功' })
                    } else {
                        res.json({ code: 0, msg: '密码错误,请重新输入' })
                    }
                })
            } else {
                res.json({ code: 0, msg: '用户未注册,请注册' })
            }
        }
    })
})

router.post('/register', (req, res) => {
    req.body.isAdmin = false
    new db.User(req.body).save(err => {
        if (err) {
            if (err.code == 11000) {
                res.json({ code: 0, msg: '用户名已存在' })
            } else {
                res.json({ code: 0, msg: '注册失败,系统出错' })
            }
        } else {
            res.json({ code: 1, msg: '注册成功，请登录' })
        }
    })
})

router.get('/user/edit/:id', (req, res) => {
    db.User.findById(req.params.id, (err, data) => {
        res.render('shop/user-edit.html', { user: data })
    })
})
router.post('/user/edit/:id', (req, res) => {
    db.User.findByIdAndUpdate(req.params.id, req.body, err => {
        if (err) {
            res.json({ code: 0, msg: '系统错误' });
        }
        else {
            res.json({ code: 1, msg: '更新成功！' });
        }
    })
})
router.get('/logout', (req, res) => {
    res.clearCookie('user');
    res.render('shop/home.html');
})

// 查询书籍：page跳转的页面，：size每页显示数量
router.get('/list/:page/:size', (req, res) => {
    var filter = {};
    var name = req.query.name;
    var type = req.query.type;
    var order = {};
    var o = req.query.order;
    if (name) {
        name = name.trim();
        if (name.length > 0) {
            filter.bookName = { '$regex': `.*${name}.*?` }
        }
    }
    if (type && type != 'undefined') {
        type = type.trim();
        filter.type = type;
    }
    if(o && o!= undefined){
        order[o] = -1;
    }
    db.Book.find(filter).sort(order).limit(parseInt(req.params.size)).exec((err, data) => {
        res.render('shop/' + req.params.page + '.html', { books: data })
    })
})

router.get('/book/:id', (req, res) => {
    db.Book.findById(req.params.id, (err, data) => {
        res.render('shop/detail.html', { book: data })
    })
})
module.exports = router;