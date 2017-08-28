var manageTabs = function () {
    var onglets = document.getElementsByClassName('onglet');
    onglets = Array.from(onglets);

    var contents = document.getElementsByClassName('content');
    contents = Array.from(contents);

    var previous = {
        tab: onglets[0],
        cont: contents[0]
    };

    (function(){
        for (let i = 0; i < onglets.length; i++) {
            if (contents[i] != previous.cont) {
                toggleElem(contents[i]);
            } else {
                addClass(onglets[i], 'active');                
            }
            onglets[i].addEventListener('mousedown', changeOnglet);
        }
    })();

    function changeOnglet () {
        console.log('this: ', this)
        if (this != previous.tab) {
            var index = onglets.indexOf(this);
            toggleElem(previous.cont);
            removeClass(previous.tab, 'active');
            previous.cont = contents[index];
            previous.tab = onglets[index];
            toggleOnglet();
            addClass(onglets[index], 'active');
        }
    }
    
    function toggleOnglet () {
        for (let i = 0; i < onglets.length; i++) {
            if (onglets[i] == previous.tab) {
                toggleElem(contents[i]);
            }
        }
    }

    function addClass (elem, newClass) {
        if (!elem || !newClass) return;
        var str = elem.getAttribute('class');
        var arr = str.split(' ');
        console.log('arr: ', arr);
        arr.push(newClass);
        str = arr.join(' ');
        elem.setAttribute('class', str);
    }

    function removeClass (elem, toDel) {
        if (!elem || !toDel) return;
        var str = elem.getAttribute('class');
        var arr = str.split(' ');
        var newarr = arr.filter(function(val) {
            if (val != toDel) return val;
        })
        str = newarr.join(' ');
        console.log('str: ', str);
        elem.setAttribute('class', str);
    }
};