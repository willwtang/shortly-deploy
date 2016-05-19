var request = require('request');
var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var util = require('../lib/utility');

var db = require('../app/config');
var User = require('../app/models/user');
var Link = require('../app/models/link');
var Users = require('../app/collections/users');
var Links = require('../app/collections/links');


exports.renderIndex = function(req, res) {
  res.render('index');
};

exports.signupUserForm = function(req, res) {
  res.render('signup');
};

exports.loginUserForm = function(req, res) {
  res.render('login');
};

exports.logoutUser = function(req, res) {
  req.session.destroy(function() {
    res.redirect('/login');
  });
};

exports.fetchLinks = function(req, res) {

  Link.find({}, function(err, links) {
    res.status(200).send(links);
  });
};

exports.saveLink = function(req, res) {
  var uri = req.body.url;

  if (!util.isValidUrl(uri)) {
    console.log('Not a valid url: ', uri);
    return res.sendStatus(404);
  }

  Link.findOne({ url: uri }, function(err, link) {
    if (link) {
      res.status(200).send(link);
      return;
    }
    util.getUrlTitle(uri, function(err, title) {
      if (err) {
        console.log('Error reading URL heading: ', err);
        return res.sendStatus(404);
      }
      var newLink = new Link({
        url: uri,
        title: title,
        baseUrl: req.headers.origin
      });
      newLink.save(function(err, data) { 
        if (err) {
          return console.log(err);
        }
        res.status(200).send(newLink);
      });
    });
  });
};

exports.loginUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  User.findOne({ username: username }, function(err, data) {

    if (err) {
      return console.log(err);
    }
    if (!data) {
      return res.redirect('/login');
    }
    bcrypt.compare(password, data.password, function(err, isMatch) {
      if (isMatch) {
        util.createSession(req, res, user);
        res.redirect('/login');
      } else {
        res.redirect('/login');
      }
    });
  });
};



exports.signupUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;
  User.findOne({ username: username}, function(err, data) {
    if (err) {
      return console.log(err);
    }
    if (!data) {
      var newUser = new User({
        username: username,
        password: password
      });
      newUser.save(function(err, data) {
        if (err) {
          return console.log(err);
        }
        util.createSession(req, res, newUser); 
        
      });
      return;
    }
    res.redirect('/signup');
  });
};

exports.navToLink = function(req, res) {
  Link.findOne({ code: req.params[0] }, function(err, link) {
    if (err) {
      return console.log(err);
    }
    if (!link) {
      res.redirect('/');
    } else {
      link.visits.$inc();
      link.save(function(err, data) {
        if (err) {
          return console.log(err);
        }  
        res.redirect(link.url);      
      });
      
    }
  });
};