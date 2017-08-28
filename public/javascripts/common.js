// Fonction pour créer une balise svg.
// shape est le nom de la balise
// attributes est un objet regroupant les attributs de la balise
var createNSsvg = function (xmlns, shape, attributes) {
  var test = true;
  if (typeof(xmlns) != 'string' && typeof(shape) != 'string' && typeof(attribute) != 'object') test = false;

  if (!test) return;

  var tag = document.createElementNS(xmlns, shape);
  for (attribute in attributes) {
    tag.setAttributeNS(null, attribute, attributes[attribute]);
  }
  return tag;
};

// Fonction qui reçoit une balise html et qui suivant l'état display le change
var toggleElem = function (targ) {
  if (!targ) return;
  var state = targ.style.display;
  if (state == 'none') targ.style.display = 'inline';
  else targ.style.display = 'none';
};

// Fonction qui classe le tableau des notes par
// rapport à celle choisi et renvoie le résultat
var sortNotes = function(note, nota) {
  if (!nota) return;
  let index;
  for (var i = 0; i < nota.length; i++) {
      if (note == nota[i]) {
          index = i;
      }
  }
  let j = 0;
  let sortedNotes= [];
  Object.assign(sortedNotes, nota);
  while (j < (sortedNotes.length-index)) {
      let mem;
      for (var i = sortedNotes.length-1; i > -1; i--) {
          if (i == sortedNotes.length-1) {
              mem = sortedNotes[i];
          }
          sortedNotes[i] = sortedNotes[i-1];
          if (i == 0) {
          sortedNotes[i] = mem;
          }
      }
      j++;
  }
  return sortedNotes;
};

// Fonction qui reçoit un tableau des notes, un obj et les notes
// pour trier en un objet facile a parcourir 
var setNote = function (array, obj, nota) {
    if (!array || !obj) return;
    nota.forEach(function(elem) {
        obj[elem] = [];
        for (let i = 0; i < array.length; i++) {
            if (elem == array[i]) obj[elem].push(i+1);
        }
    })
};