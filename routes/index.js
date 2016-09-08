var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/User');
const passport = require('passport');
const requiresLogin = require('./mid');

/* GET home page. */
router.get('/', function(req, res, next) {
	User.find({}, (err, users)=>{
		if(err) return next(err);
		res.render('index', { title: 'Pinterest', user: req.session.user, users: users });		
	});
  
});

/* GET new post page */
router.get('/new_post', requiresLogin, (req, res, next)=>{
	res.render('new_post', {title: 'Add new post',  user: req.session.user  });
});



router.get('/auth/twitter',
  passport.authenticate('twitter'));

router.get('/auth/twitter/return', 
  passport.authenticate('twitter', { failureRedirect: '/' }),
  function(req, res) {
    // Successful authentication, redirect home.
   	req.session.user = req.user;
    res.redirect('/');
  });

router.get('/logout', (req, res, next)=>{
	req.session.destroy();
	req.logout();
	res.render('index', {title: 'Pinterest'});
});

/* GET profile page */
router.get('/my_pics', requiresLogin,  (req, res, next)=>{
	let user = req.session.user.displayName;
	User.findOne({displayName: user}, (err, user)=>{
		if(err) return next(err);
		res.render('my_pics', {title: 'My Pictures', user: req.session.user, userImages: user});
	});

});

/* GET post of a certain user */
router.get('/:userId', (req, res, next)=>{
	let username = req.params.userId;
	User.findOne({username: username}, (err, user)=>{
		if(err) return next(err);
		res.render('index', {title:'Pinterest', user: req.session.user, oneUser: user});
	});
});

/* POST new page */
router.post('/new_post', (req, res, next)=>{
	let url = req.body.url;
	let name = req.body.name;
	let user = req.session.user.displayName;
	User.findOne({displayName: user}, (err, user)=>{
		if(err) return next(err);
		user.images.push({url: url, name: name});
		user.save();
		res.redirect('/');
	});
	
});

router.delete('/my_pics/:picId', (req, res, next)=>{
	User.findOne({displayName: req.session.user.displayName}, (err, user)=>{
		if(err) return next(err);
		user.images.map((img, i)=>{
			if(img._id == req.params.picId){
				user.images.splice(i, 1);
			}
		});
		user.save();
		res.render('my_pics', {title: 'My Pictures', user: req.session.user, userImages: user});
	});
});

module.exports = router;
