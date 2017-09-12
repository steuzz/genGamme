var express = require('express');
var router = express.Router();
var db = require('../db.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  db.note.find(function(err, note) {
    if (err) throw err;
    res.render('admin', {
      title: 'Générateur de Gamme',
      gammes: db.gamme.all,
      notes: note,
      accords: db.accordage.all,
      isAdmin: true
    })
  })
});

module.exports = router;
