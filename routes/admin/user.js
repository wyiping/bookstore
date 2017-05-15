const express = require("express");
const db = require('../../my_modules/db');
const check = require('../../my_modules/check');

var router = express.Router()
router.get('/', check, (req, res) => {
    res.render('back/admin');
})

// 管理员登录页面
router.get('/login', (req, res) => {
    res.render('back/login')
})
// 处理管理员登录请求
router.post('/login', (req, res) => {
    db.User.find({ username: req.body.username }).count((err, count) => {
        if (err) {
            res.json({ code: 0, msg: '系统错误,请重试' })
        } else {
            if (count > 0) {
                db.User.findOne({ username: req.body.username }, (err, data) => {
                    // 判断是否为管理员
                    if (data.isAdmin) {
                        if (req.body.password == data.password) {
                            // 设置cookie 30分钟
                            res.cookie('user',
                                { username: data.username, petname: data.petname, id: data._id },
                                { maxAge: 1000 * 60 * 30 }
                            )
                            res.json({ code: 1, msg: '登录成功' })
                        } else {
                            res.json({ code: 0, msg: '密码错误,请重新输入' })
                        }
                    } else {
                        res.json({ code: 0, msg: '此用户不是管理员' })
                    }

                })
            } else {
                res.json({ code: 0, msg: '用户未注册,请注册' })
            }
        }
    })
})

// 管理员注销
router.get('/logout', (req, res) => {
    res.clearCookie('user');
    res.render('back/login')
})
module.exports = router;