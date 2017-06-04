const express = require("express");
const db = require('../my_modules/db');
var router = express.Router()

// 格式日期
function formatTime(t) {
    var M = t.getMonth() + 1,
        d = t.getDate(),
        h = t.getHours(),
        m = t.getMinutes();
    M = M < 10 ? '0' + M : M
    d = d < 10 ? '0' + d : d
    h = h < 10 ? '0' + h : h
    m = m < 10 ? '0' + m : m
    return t.getFullYear() + '-' + M + '-' + d + ' ' + h + ':' + m
}

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

// 订单
router.get('/order/:id', (req, res) => {
    db.Order.find({ user: req.params.id }).populate('user product.book').exec((err, data) => {
        res.render('shop/order.html', {
            orders: data.map(m => {
                m = m.toObject();
                m.createTime = formatTime(m.createTime);
                return m
            })
        })
    })
})

// 订购
router.post('/order', (req, res) => {
    req.body.createTime = new Date();
    new db.Order(req.body).save(err => {
        if (err) {
            res.json({ code: 0, msg: '订购失败,系统出错' })
        } else {
            res.json({ code: 1, msg: '订购成功。' })
        }
    })
})

module.exports = router;