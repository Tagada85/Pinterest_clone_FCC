let requiresLogin = function requiresLogin(req, res, next){
	if(!req.session.user){
		const err = new Error('You must be logged in to see this page');
		err.status = 401;
		return next(err);
	}
	next();
}

module.exports = requiresLogin;