const express = require("express");
const db = require('../../my_modules/db');
var router = express.Router()

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

router.post('/cart/add', (req, res) => {
    db.Cart.find({ user: req.body.user, book: req.body.book }).count((err, count) => {
        if (count > 0) {
            res.json({ code: 1, msg: '已经添加到购物车！' })
        } else {
            new db.Cart(req.body).save(err => {
                if (err) {
                    res.json({ code: 0, msg: '添加失败。' })
                } else {
                    res.json({ code: 1, msg: '添加成功！' })
                }
            })
        }
    })
})
module.exports = router;