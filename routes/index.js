var mongoose = require('mongoose');
var Prefs = mongoose.model('Prefs');
/*
 * GET home page.
 */

exports.index = function(req, res){
	req.facebook.api('/me', function(err, user) {
		req.session.name = user.name;
		console.log(req.session);
		Prefs
			.findOne({uid: user.id})
			.exec(function(err, pref){
				if (err) throw err;
				if (pref){
					res.render('index', {bg: pref.bg, font: pref.font, border: pref.border, fontColor: pref.fontColor, name:req.session.name, uid:req.session.user_id, title:'ShittyFaceSpace'});
				}
				else {
					new Prefs({
						uid: user.id
					}).save(function(err, newPref){
						if (err) throw err;
						res.render('index', {bg: newPref.bg, font:newPref.font, border: pref.border, fontColor: pref.fontColor, name:req.session.name, uid:req.session.user_id, title:'ShittyFaceSpace'});
					})
				}
			});
	});
}

exports.login = function(req, res){
	res.redirect('/');
}

exports.update = function(req, res){
	Prefs.findOne({uid: req.session.user_id}).exec(function(err, pref){
		if (err) throw err;
		pref.update({bg: req.body.color, font: req.body.font, fontColor: req.body.fontColor, border: req.body.border}, function(err){
			if (err) throw err;
		});
	});
}