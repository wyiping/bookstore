const express = require("express");
const db = require('../../my_modules/db');
// 获取显示的页数，最多10页
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

router.get('/list/(:page)?', (req, res) => {
    var page = req.params.page;
    page = page || 1;
    page = parseInt(page);
    var order = { 'createTime': 1 };
    var pageSize = 10;

    db.Order.find().count((err, total) => {
        if (err) {
            console.log(err)
        } else {
            var pageCount = Math.ceil(total / pageSize);
            page = page > pageCount ? pageCount : page
            page = page < 1 ? 1 : page;
            // select对数据属性进行筛选，属性名之间用空格分隔
            db.Order.find().sort(order).skip((page - 1) * pageSize).limit(pageSize).populate('user product.book').exec((err, data) => {
                res.render('back/order/list.html', {
                    page, pageCount, pageSize, order, pages: getPages(page, pageCount),
                    orders: data.map(m => {
                        m = m.toObject();
                        m.id = m._id.toString()
                        delete m._id
                        m.createTime = formatTime(m.createTime);
                        return m
                    })
                })
            })
        }
    })
})
router.post('/del/:id', (req, res) => {
    db.Order.findByIdAndRemove(req.params.id, err => {
        if (err) {
            res.json({ code: 0, msg: '系统错误' });
        }
        else {
            res.json({ code: 1, msg: '删除成功！' });
        }
    })
})
module.exports = router;