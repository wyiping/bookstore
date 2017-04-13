const multer = require('multer')

var storage = multer.diskStorage({
    // 设置上传后的文件目录为upload，该目录会自动创建
    destination: './wwwroot/images/scenery',
    filename: function (req, file, cb) {
        cb(null,req.body.name + '_' + String(Math.random() * 10).replace('.','')  +'.jpg')
    }
})

var upload = multer({storage})

module.exports = upload;