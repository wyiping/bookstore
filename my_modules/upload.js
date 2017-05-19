const multer = require('multer')

var storage = multer.diskStorage({
    destination: './wwwroot/img/book',
    filename: function (req, file, cb) {
        cb(null, req.body.bookName + '.jpg')
    }
})

var upload = multer({ storage })

module.exports = upload;