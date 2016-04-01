var mongoose = require('mongoose');
var db = require('../config');
var crypto = require('crypto');

var urlSchema = mongoose.Schema({
  url: String,
  baseUrl: String,
  title: String,
  visits: Number,
  timestamps: Date,
  code: String
});

var createSha = function(url) {
  var shasum = crypto.createHash('sha1');
  shasum.update(url);
  return shasum.digest('hex').slice(0, 5);
};

urlSchema.pre('save', function(next) {
  var code = createSha(this.url);
  this.code = code;
  next();
});

// Link.methods.createTable = function(doc, opts, fn) {

//   this.on('creating', function(model, attrs, options) {
//     var shasum = crypto.createHash('sha1');
//     shasum.update(model.get('url'));
//     model.set('code', shasum.digest('hex').slice(0, 5));
//   });
// };

var Link = mongoose.model('Link', urlSchema);

// String
// Number
// Date
// ObjectId
// Boolean
// Array

// var Link = db.Model.extend({
//   tableName: 'urls',
//   hasTimestamps: true,
//   defaults: {
//     visits: 0
//   },
//   initialize: function() {
//     this.on('creating', function(model, attrs, options) {
//       var shasum = crypto.createHash('sha1');
//       shasum.update(model.get('url'));
//       model.set('code', shasum.digest('hex').slice(0, 5));
//     });
//   }
// });


// db.knex.schema.hasTable('urls').then(function(exists) {
//   if (!exists) {
//     db.knex.schema.createTable('urls', function (link) {
//       link.increments('id').primary();
//       link.string('url', 255);
//       link.string('baseUrl', 255);
//       link.string('code', 100);
//       link.string('title', 255);
//       link.integer('visits');
//       link.timestamps();
//     }).then(function (table) {
//       console.log('Created Table', table);
//     });
//   }
// });

module.exports = Link;
