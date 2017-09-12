var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

var promise = mongoose.connect('mongodb://localhost/Guitare', {
  useMongoClient: true
});

promise.then(function (err, db) {
  if (err) throw err;
  else console.log('Connected');
})

// mongoose.connect('mongodb://127.0.0.1:27017/Guitare', function(err) {
//   if (err) {
//     throw err;
//   } else {
//     console.log('Connected');
//   }
// });

// Schéma définissant la collection Note
var noteSchema = new mongoose.Schema({
  _id: {type: mongoose.Schema.ObjectId},
  notation: {type: Array}
});

var gammeSchema = new mongoose.Schema({
  name: {type: String},
  inters : {type: Array}
});

var accordSchema = new mongoose.Schema({
  name: {type: String},
  accordage : {type: Array}
});

// Association entre schéma et la collection, renvoie un modèle mongoose
var collecNote = mongoose.model('Note', noteSchema, 'note');

// Object que l'on exporte pour les appeles envers la base de données
var gamme = model('Gamme', gammeSchema, 'gamme');
var accordage = model('Accordage', accordSchema, 'accordage');

gamme.findAll();
accordage.findAll();

function model (name, schema, str) {
  var obj = {};

  obj.collec = mongoose.model(name, schema, str);

  obj.add = function (data) {
    delete data.type;
    var item = new obj.collec(data);
    item.save(function (err, res) {
      if (err) return console.error(err);
      console.log('ajout réussit!');
      obj.findAll();
    })
  }

  obj.findAll = function () {
    obj.collec.find({}, function(err, res) {
      if (err) throw err;      
      obj.all = res;
    })
  }

  obj.modif = function (data) {
    delete data.type;
    var query = {_id: new ObjectId(data.id)};
    console.log('query: ', query);
    obj.collec.findOneAndUpdate(query, data, function (err, res) {
      if (err) return console.error(err);
      console.log('modification réussit!');
      obj.findAll();
    })
  }

  obj.delete = function (data) {
    delete data.type;
    var query = {_id: new ObjectId(data.id)};
    console.log('query: ', query);
    obj.collec.findOneAndRemove(query, function (err, res) {
      if (err) return console.error(err);
      console.log('res: ', res);
      console.log('suppression réussit!');
      obj.findAll();
    })
  }

  return obj
};



module.exports = {
  note: collecNote,
  gamme: gamme,
  accordage: accordage
};