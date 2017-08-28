var express = require('express');
var router = express.Router();
var db = require('../db');

router.post('/', function(req, res, next) {
    console.log('req.body: ', req.body)
    var data = req.body;
    db.gamme.add(data);  
    res.send("Attention à l'échec");
});

module.exports = router;