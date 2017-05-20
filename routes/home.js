const express = require("express");
const db = require('../my_modules/db');

var router = express.Router();

router.get('', (req, res) => {
    res.render('shop/home.html');
})

router.get('/list/:page/:size', (req, res) => {
    db.Book.find().limit(parseInt(req.params.size)).exec((err, data) => {
        res.render('shop/' + req.params.page + '.html', { books: data })
    })
})

router.get('/book/:id', (req, res) => {
    db.Book.findById(req.params.id, (err, data) => {
        res.render('shop/detail.html', { book: data })
    })
})
module.exports = router;