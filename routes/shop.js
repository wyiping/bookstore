const express = require("express");
const db = require('../my_modules/db');
var router = express.Router()

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

router.post('/cart/del', (req, res) => {
    db.Cart.findByIdAndRemove(req.body.id, err => {
        if (err) {
            res.json({ code: 0, msg: '删除失败。' })
        } else {
            res.json({ code: 1, msg: '删除成功！' })
        }
    })
})
router.get('/cart/list/:id', (req, res) => {
    db.Cart.find({ user: req.params.id }).populate('book').exec((err, data) => {
        res.render('shop/cart.html', { cart: data })
    })
})

router.post('/order', (req, res) => {
    new db.Order(req.body).save(err => {
        if (err) {
            res.json({ code: 0, msg: '订购失败,系统出错' })
        } else {
            res.json({ code: 1, msg: '订购成功。' })
        }
    })
})

module.exports = router;