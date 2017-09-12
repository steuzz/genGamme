var Guitare = function () {
    var self = this;
    var typeNote, intersGamme, fondamentale;
    
    this.accordage = [];
    this.notes = [];
    this.gamme;
    
    // Fonction init, est appelé au chargement de la page
    this.init = function () {
        self.gamme = new Gamme();
        checkAccordage();
        getNote();
        checkNotes();
    }

    // Emplacement pour les event
    this.doEvent= function (guitSvg) {

        // Partie des events nécessaire pour l'affichage de gamme
        var selGamme = document.getElementById('ch_gamme');
        selGamme.addEventListener('change', checkGamme);
        var selFondamentale = document.getElementById('ch_fondamentale');
        selFondamentale.addEventListener('change', checkFondamentale);
        var btnShowGamme = document.getElementById('showGamme');
        btnShowGamme.addEventListener('click', function (e) {
            showGamme(e, guitSvg.setNotes);
            guitSvg.initColor();
        });

        eventAccordage(guitSvg);

    }

    // Fonction qui récupère la valeur du select d'accordage
    var checkAccordage = function () {
        if (this == window) {
            var select = document.getElementById('ch_accordage');
            var res = select.selectedOptions[0].innerText;
            res = res.trim();
        } else {
            var res = this.selectedOptions[0].innerText;
        }
        res = res.split(',');
        if (res != self.accordage) {
            self.accordage = res;
        }
    };

    // Fonction qui récupère la valeur du select de type Notation
    var getNote = function () {
        var elemDOM = document.getElementById('forGetNote');
        var res = elemDOM.getAttribute('data-notes').trim().split(',');
        if (res != typeNote) {
            typeNote = res;
        }
    }

    // Fonction qui d'après l'accordage construit un tableaux avec toutes les notes
    // du manche dans l'ordre de position;
    var checkNotes = function () {
        while (self.notes.length > 1) {
            self.notes.pop();
            self.notes.shift();
        }
        for (let i = 0; i < self.accordage.length; i++) {
            var res = sortNotes(self.accordage[i], typeNote);
            for (let j = 0; j < 15; j++) {
                if (j > 11) {
                    self.notes.push(res[j-12]);
                } else {
                    self.notes.push(res[j]);
                }
            }
        }
        console.log('notes at end checkNotes: ', self.notes)
        if (self.gamme.hasBeenInit) {
            self.gamme.changeNotes(self.notes);
        }
    }

    // Fonction qui récupère la valeur du select de gamme
    var checkGamme = function () {
        var res = this.selectedOptions[0].getAttribute('data-inters');
        res = res.split(',');
        if (intersGamme != res) intersGamme = res;
    }

    // Fonction qui récupère la valeur du select fondamentale
    var checkFondamentale = function () {
        var res = this.selectedOptions[0].innerText;
        if (fondamentale != res) fondamentale = res;
    }

    // Fonction a appelé pour initialiser une gamme et l'afficher
    var notFirstRun = false;
    var showGamme = function (e, func) {
        if (!intersGamme) return alert('Impossible! Veuillez choisir une gamme.');
        if (!fondamentale) return alert('Impossible! Veuillez choisir une fondamentale.');
        
        if (!notFirstRun) {
            self.gamme.init(fondamentale, intersGamme, self.notes, func);
            notFirstRun = true;
        } else {
            self.gamme.changeGamme(fondamentale, intersGamme);
        }
        
    }

    // Fonction qui gère les events en rapport avec l'accordage
    var eventAccordage = function (guitSvg) {
        var selAccordage = document.getElementById('ch_accordage');
        selAccordage.addEventListener('change', function() {
            checkAccordage();
            guitSvg.changeAccordage(self.accordage);
            checkNotes();
            guitSvg.changeNotes(self.notes);
            guitSvg.initColor();
        });
    }
};


// Gamme, objet pour gérer les gammes (afficher, cacher, changer)
var Gamme = function () {
    var self = this;
    var flag = false;
    var inters = ["F", "2m", "2M", "3m", "3M", "4j", "b5", "5j", "6m", "6M", "7m", "7M"];
    var nota = ["Do", "Do#", "Ré", "Ré#", "Mi", "Fa", "Fa#", "Sol", "Sol#", "La", "La#", "Si"];
    var fondamentale, gamme;
    var notes = {};
    var actual = []; // Notes actuellement nécessaire par la gamme
    var funcSVG;
    this.hasBeenInit = false;

    // Fonction qui initialise les variables avec celles données
    this.init = function (fonda, newGamme, allNotes, func) {
        fondamentale = fonda;
        gamme = newGamme;
        if (allNotes) setNote(allNotes);
        toggleGamme();
        createTable();
        flag = true;
        console.log('flag: ', flag)
        funcSVG = func;
        console.log('funcSVG: ', funcSVG);
        funcSVG(notes);
        self.hasBeenInit = true;
    }

    this.onResize = function () {
        if (flag) {
            toggleGamme();
        }
    }

    // Fonction qui trie le tableau des notes (arguments),
    // pour remplir l'obj notes
    var setNote = function (array) {
        if (!array) return;
        nota.forEach(function(elem) {
            notes[elem] = [];
            for (let i = 0; i < array.length; i++) {
                if (elem == array[i]) notes[elem].push(i+1);
            }
        })
    };

    // Fonction pour afficher ou cacher la gamme
    var toggleGamme = function () {
        var sorted = sortNotes(fondamentale, nota);
        for (let i = 0; i < inters.length; i++) {
            for (let j = 0; j < gamme.length; j++) {
                if (inters[i] == gamme[j]) {
                    var note = sorted[i];
                    notes[note].forEach(function (elem) {
                        var shape = document.getElementById('note'+elem);
                        toggleElem(shape);
                        actual.push(elem);
                    });
                }
            }
        }
    }

    // Fonction pour changer la gamme suivant les nouveaux choix
    this.changeGamme = function (fonda, newGamme) {
        if (fondamentale == fonda && gamme == newGamme) {
            toggleGamme();
            toggleTable();
            if (flag) flag = false
            else flag = true;
            console.log('flag: ', flag)
        } else {
            cleanManche();
            fondamentale = fonda;
            gamme = newGamme;
            toggleGamme();
            createTable();
            flag = true;
            console.log('flag: ', flag)
        }
    }

    // Fonction pour enlever toutes les notes afficher du manche
    var cleanManche = function () {
        actual.forEach(function(elem) {
            // toggleElem(document.getElementById('note'+elem));
            document.getElementById('note'+elem).style.display = 'none';
        })
    }

    this.changeNotes = function (array) {
        setNote(array);
        funcSVG(notes)
        cleanManche();
        console.log('flag: ', flag);
        if (flag) {
            console.log('in flag true');
            toggleGamme();
            // toggleTable();
            // document.getElementById('tableGamme').style.display = 'none';
        }
    }

    var createTable = function () {
        var target = document.getElementById('tableGamme');
        if (target.firstChild) {
            target.removeChild(target.firstChild);
        }
        var table = document.createElement('table');
        table.setAttribute('class', 'table')
        let caption = document.createElement('caption');
        let titre = document.createTextNode('Tableau représentatif des notes et intervals.');
        caption.appendChild(titre);
        table.appendChild(caption);

        // Créer le corps du tableau
        let tBody = table.createTBody();
        let rowInters = tBody.insertRow();
        let rowNotes = tBody.insertRow();
        var toShow = sortNotes(fondamentale, nota);
        for (var i = 0; i < inters.length; i++) {
            let cellI = rowInters.insertCell();
            let textI = document.createTextNode(inters[i])
            cellI.appendChild(textI);
            let cellN = rowNotes.insertCell();
            let textN = document.createTextNode(toShow[i]);
            cellN.appendChild(textN);
            for (let j = 0; j < gamme.length; j++) {
                if (inters[i] == gamme[j]) {
                    cellN.style.color = "#F00"
                }
            }
            
        }
        target.appendChild(table);
    }

    var toggleTable = function () {
        toggleElem(document.getElementById('tableGamme'))
    }

};