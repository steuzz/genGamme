function main () {
    var DomModalGamme = document.getElementById('gamme');
    var modalGamme = new Modal(DomModalGamme);

    var btnAddGamme = document.getElementById('addGamme');
    btnAddGamme.addEventListener('click', function() {
        modalGamme.call('add');
    }, false);

    var btnsModif = document.getElementsByClassName('modifGamme');
    for (let i = 0; i < btnsModif.length; i++) {
        btnsModif[i].addEventListener('click', modalGamme.call);
    }


}

var Modal = function (elem) {
    var self = this;
    var modal = elem;
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
        modal.style.display = "none";
        console.log('title: ', title)
        title.removeChild(title.firstChild);
        if (type != 1) {
            var check = document.getElementsByName('inters');
            for (let i = 0; i < check.length; i++) {
                check[i].removeAttribute('checked');
            }
            form.firstElementChild.value = '';
        }
    };

    var setAction = function () {
        if (type == 1) {
            form.setAttribute('action', 'self.addDb()');
        } else {
            form.setAttribute('action', 'self.modifDb()');
        }
    }

    this.addDb = function () {
        getContent();
        
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
                    
                } else {
                    console.log("error ajax")
                }
            }
        }   

        hide();

    }

    this.modifDb = function () {
        getContent();

        var req = new XMLHttpRequest();
        req.onreadystatechange = manageState;

        req.open('POST', './modifDB', true);
        req.setRequestHeader('Content-Type', 'application/json');
        req.send(JSON.stringify(json));

        hide();

        function manageState () {
            // Traitement de la réponse
            if (req.readyState == XMLHttpRequest.DONE) {
                console.log('req: ', req.readyState)
                if (req.status == 200) {
                    
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
    };

    var setContent = function () {
        if (!id || !inters || !name ) return ;
        console.log('form: ', form);
        form.firstElementChild.value = name;
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

        var btnSend = document.getElementById('sendData');
        btnSend.addEventListener('click', self.addDb);
    };

    // Fonction qui simule un init à l'appel de new Modal
    (function(){
        event();
    })();

    
}

window.onload = main();