const express = require("express");
const db = require('../my_modules/db');

var router = express.Router();
function getPages(page, pageCount) {
    var pages = [page];
    var left = page - 1;
    var right = page + 1;
    // 左右两边各加1个页码,直到页码够10个或左边到1 右边到总页数
    while (pages.length < 10 && (left >= 1 || right <= pageCount)) {
        if (left > 0) pages.unshift(left--);
        if (right <= pageCount) pages.push(right++);
    }
    return pages;
}
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

// 查询书籍:view跳转的页面,:size每页显示数量,:page页数
router.get('/list/:view/:size/(:page)?', (req, res) => {
    var page = req.params.page;
    page = page || 1;
    page = parseInt(page);
    var pageSize = parseInt(req.params.size);

    var filter = {};
    var search = req.query.search;
    var type = req.query.type;
    var order = {};
    var o = req.query.order;
    if (search) {
        search = search.trim();
        if (search.length > 0) {
            filter.bookName = { '$regex': `.*${search}.*?` }
        }
    }
    if (type && type != 'undefined') {
        type = type.trim();
        filter.type = type;
    }
    if (o && o != undefined) {
        order[o] = -1;
    }
    db.Book.find(filter).count((err, total) => {
        var pageCount = Math.ceil(total / pageSize);
        page = page > pageCount ? pageCount : page
        page = page < 1 ? 1 : page;
        db.Book.find(filter).sort(order).skip((page - 1) * pageSize).limit(pageSize).exec((err, data) => {
            res.render('shop/' + req.params.view + '.html', {
                page, pageCount, pageSize, order, pages: getPages(page, pageCount), type, search,
                books: data
            })
        })
    })
})

router.get('/book/:id', (req, res) => {
    db.Book.findById(req.params.id, (err, data) => {
        res.render('shop/detail.html', { book: data })
    })
})
module.exports = router;