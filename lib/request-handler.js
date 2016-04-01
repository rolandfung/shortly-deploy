var request = require('request');
var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var util = require('../lib/utility');
var Promise = require('bluebird');
var db = require('../app/config');
var User = require('../app/models/user');
var Link = require('../app/models/link');
// var Users = require('../app/collections/users');
// var Links = require('../app/collections/links');
var hashProm = Promise.promisify(bcrypt.hash);

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
  Link.find({}).exec(function(err, links) {
    res.send(200, links);
  })
};

exports.saveLink = function(req, res) {
  var uri = req.body.url;

  if (!util.isValidUrl(uri)) {
    console.log('Not a valid url: ', uri);
    return res.send(404);
  }

  Link.findOne({ url: uri }, function(err, found){
    if (found) {
      res.send(200, found);
    } else {
      util.getUrlTitle(uri, function(err, title) {
        if (err) {
          console.log('Error reading URL heading: ', err);
          return res.send(404);
        }
        var newLink = new Link({
          url: uri,
          title: title,
          baseUrl: req.headers.origin,
          visits: 0
        }).save(function(err, newLink) {
          console.log(newLink);
          res.send(200, newLink);
        });
      });
    }
  });
};

exports.loginUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  User.findOne({ username: username }).exec(function(err, user) {
    if (err || !user) {
      res.redirect('/login');
    } else {
      user.comparePassword(password, function(match) {
        if (match) {
          util.createSession(req, res, user);
        } else {
          res.redirect('/login');
        }
      })
    }
  });
};

exports.signupUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  User.findOne({ username: username }, function(err, user) {
      if (!user) {

        hashProm(password, null, null).then(function(hashed) {
          var newUser = new User({
            username: username,
            password: hashed
          }).save(function(err, newUser) {
            util.createSession(req, res, newUser);
          });
        })

      } else {
        res.redirect('/signup');
      }
    });
};

exports.navToLink = function(req, res) {
  Link.findOne({ code: req.params[0] }, function(err, link) {
    if (err || !link) {
      res.redirect('/');
    } else {
      link.visits++;
      link.save(function(err, link) {
        res.redirect(link.url);
        return;
      });
    }
  });
};