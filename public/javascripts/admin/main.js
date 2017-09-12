function main () {
    // Partie qui gère les gammes
    var DomModalGamme = document.getElementById('gamme');
    var modalGamme = new Modal(DomModalGamme, 'gamme');

    var btnAddGamme = document.getElementById('addGamme');
    btnAddGamme.addEventListener('click', function() {
        modalGamme.call('add');
    });

    var btnsModifGamme = document.getElementsByClassName('modifGamme');
    for (let i = 0; i < btnsModifGamme.length; i++) {
        btnsModifGamme[i].addEventListener('click', modalGamme.call);
    }

    var btnsDeleteGamme = document.getElementsByClassName('delGamme');
    for (let i = 0; i < btnsDeleteGamme.length; i++) {
        btnsDeleteGamme[i].addEventListener('click', modalGamme.delDB);
    }


    // Partie qui gère les accordages
    var DomModalAccordage = document.getElementById('accordage');
    var modalAccordage = new Modal(DomModalAccordage, 'accordage');

    var btnAddAccordage = document.getElementById('addAccordage');
    btnAddAccordage.addEventListener('click', function() {
        modalAccordage.call('add');
    });

    var btnsModifAccordage = document.getElementsByClassName('modifAccordage');
    for (let i = 0; i < btnsModifAccordage.length; i++) {
        btnsModifAccordage[i].addEventListener('click', modalAccordage.call);
    }

    var btnsDeleteAccordage = document.getElementsByClassName('delAccordage');
    for (let i = 0; i < btnsDeleteAccordage.length; i++) {
        btnsDeleteAccordage[i].addEventListener('click', modalAccordage.delDB);
    }

}

var Modal = function (elem, modalName) {
    var self = this;
    var modal = elem;
    var modalName = modalName;
    var form = modal.firstElementChild.lastElementChild.firstElementChild;
    var title = modal.firstElementChild.firstElementChild.lastElementChild.firstElementChild;
    var type;
    var json = {};

    // Pour les modifs emplacement pour les données actuelles
    var id, inters, name;
    

    // Fonction qui gère l'appel des différents bouttons
    this.call = function (str) {
        if (str == 'add') {
            type = 1;
            var textTitle = document.createTextNode('Ajouter');
            title.appendChild(textTitle);
            setAction();
        } else {
            type = 2;
            console.log('str: ', str);
            if (str.target.tagName == 'SPAN') {
                id = str.target.parentElement.getAttribute('data-id');
                inters = str.target.parentElement.getAttribute('data-inters').split(',');
                name = str.target.parentElement.parentElement.parentElement.innerText;
            } else {
                id = str.target.getAttribute('data-id');
                inters = str.target.getAttribute('data-inters').split(',');
                name = str.target.parentElement.parentElement.innerText;
            }
            var textTitle = document.createTextNode('Modifier');
            title.appendChild(textTitle);
            setAction();
            setContent();
        }
        show();
    }

    // Fonction pour afficher la modal
    var show = function () {
        modal.style.display = 'block';
    };

    // Fonction pour cacher la modal
    var hide = function () {
        if (type != 3) {
            modal.style.display = "none";
            console.log('title: ', title)
            title.removeChild(title.firstChild);
        }
        if (type != 1) {
            var check = document.getElementsByName('inters');
            for (let i = 0; i < check.length; i++) {
                check[i].removeAttribute('checked');
            }
            form.firstElementChild.value = '';
        }
        json = {};
        // window.location.reload(true);
    };

    var setAction = function () {
        var btnSubmit = form.lastElementChild;
        if (type == 1) {
            btnSubmit.removeEventListener('click', self.modifDb);
            btnSubmit.addEventListener('click', self.addDb);
        } else {
            btnSubmit.removeEventListener('click', self.addDb);
            btnSubmit.addEventListener('click', self.modifDb);
        }
    }

    this.addDb = function () {
        getContent();
        console.log('json: ', json);
        
        var req = new XMLHttpRequest();

        req.onreadystatechange = manageState;

        req.open('POST', './addDB', true);
        req.setRequestHeader('Content-Type', 'application/json');
        req.send(JSON.stringify(json));

        function manageState () {
            // Traitement de la réponse
            if (req.readyState == XMLHttpRequest.DONE) {
                console.log('req: ', req.readyState)
                if (req.status == 200) {
                    hide();
                } else {
                    console.log("error ajax")
                }
            }
        }   
    }

    this.modifDb = function () {
        getContent();
        console.log('json: ', json);

        var req = new XMLHttpRequest();
        req.onreadystatechange = manageState;

        req.open('POST', './modifDB', true);
        req.setRequestHeader('Content-Type', 'application/json');
        req.send(JSON.stringify(json));

        function manageState () {
            // Traitement de la réponse
            if (req.readyState == XMLHttpRequest.DONE) {
                console.log('req: ', req.readyState)
                if (req.status == 200) {
                    hide();
                } else {
                    console.log("error ajax")
                }
            }
        }
    }

    this.delDB = function (e) {
        type = 3;
        if (e.target.tagName == "SPAN") {
            id = e.target.parentElement.previousElementSibling.getAttribute('data-id');
        } else {
            id = e.target.previousElementSibling.getAttribute('data-id');
        }
        json.id = id;
        json.type = modalName;
        console.log('json: ', json);

        var req = new XMLHttpRequest();
        req.onreadystatechange = manageState;

        req.open('POST', './delDB', true);
        req.setRequestHeader('Content-Type', 'application/json');
        req.send(JSON.stringify(json));

        function manageState () {
            // Traitement de la réponse
            if (req.readyState == XMLHttpRequest.DONE) {
                console.log('req: ', req.readyState)
                if (req.status == 200) {
                    hide();
                } else {
                    console.log("error ajax")
                }
            }
        }
    }

    var getContent = function () {
        var dataForm = new FormData(form);
        var prev;
        for (let key of dataForm.keys()) {
            if (prev != key) {
                json[key] = dataForm.getAll(key);
                if (json[key].length == 1) {
                    json[key] = json[key][0];
                }
            }
            prev = key;
        }
        if (type == 2) {
            json.id = id;
        }
        json.type = modalName;
    };

    var setContent = function () {
        if (!id || !inters || !name ) return ;
        form.firstElementChild.value = name;
        if (modalName == "gamme") {
            var check = document.getElementsByName('inters');
            console.log('check: ', check);
            console.log('inters: ', inters);
            inters.forEach(function (elem) {
                for (let i = 0; i < check.length; i++) {
                    if (check[i].value == elem) {
                        console.log('elem: ', elem)
                        check[i].setAttribute('checked', 'true');
                    }
                }
            })
        } else {
            var select = document.getElementsByName('accordage');
            var k = 0;
            inters.forEach(function (elem) {
                var opts = select[k].children;
                console.log('opts: ', opts);
                for (let i = 0; i < opts.length; i++) {
                    if (opts[i].innerHTML == elem) {
                        console.log('elem: ', elem);
                        opts[i].setAttribute('selected', true);
                    }
                }
                k++;
            })
        }
    }


    // Les events de la modal
    var event = function () {
        window.onclick = function (evt) {
            if (evt.target == modal) {
                hide();
            }
        }

        var close = modal.children[0].firstElementChild.firstElementChild;
        close.addEventListener('click', function() {
            hide();
        })
    };

    // Fonction qui simule un init à l'appel de new Modal
    (function(){
        event();
    })();

    
}

window.onload = main();