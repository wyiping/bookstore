function checkLogin(req, res, next) {
	if (req.cookies.user) {
		next();
	} else {
		//req.xhr是一个bool值，true表示该请求是ajax请求，false表示req是
		//一个普通浏览器请求或表单请求。
		if (req.xhr) {
			//如果是ajax请求则返回json数据
			res.json({ err: 1, status: "请先登录" });
		} else {
			//如果是网页请求，则重定向到登录页
			res.redirect("/admin/login");
		}
	}
}

module.exports = checkLogin;