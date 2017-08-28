var drawGuitare = function () {
    var xmlns = "http://www.w3.org/2000/svg";
    var self = this;

    var svg, height, width, x, y1, y2, target, timeID;
    var notes = {};

    this.init = function () {
        createSVG();
        getParams();
        drawFond();
        drawFrete();
        drawPoint();
        drawCorde();
    }

    // --------------------------------------------------
    // ------------------ LES FONCTION ------------------
    // --------------------------------------------------

    // Fonction pour ajouter une balise svg
    var addSVG = function (toAdd) {
        svg.appendChild(toAdd);
    };

    // Fonction pour assigner une valeur aux variables
    var getParams = function () {
        height = svg.height.baseVal.value;
        width = target.clientWidth;
        x = width*10/100;
        y1 = height*6/100;
        y2 = height*90/100;
    };

    // Fonction pour créer la balise SVG
    var createSVG = function () {
        svg = document.createElementNS(xmlns, 'svg');
        target = document.getElementById('svg');
        svg.setAttribute("width", '100%');
        svg.setAttribute('height', '200px');
        svg.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");
        target.appendChild(svg);
    };

    // Fonction pour dessiner le fond de la guitare
    var drawFond = function () {
        var teteShape = 'path';
        var tetePath = "M0 0 L" + x + " " + y1;
        tetePath += " L" + x + " " + y2;
        tetePath += " L" + (x/2) + " " + height;
        tetePath += " L0" + " " + height + " Z";
        var teteAttributes = {
        d: tetePath,
        fill: '#663b01'
        };
        var tete = createNSsvg(xmlns, teteShape, teteAttributes);

        var mancheShape = 'path';
        var manchePath = "M" + x + " " + y1;
        manchePath += " L" + width + " " + 0;
        manchePath += " L" + width + " " + height;
        manchePath += " L" + x + " " + y2 + " Z";
        var mancheAttributes = {
        d: manchePath,
        fill: '#472200'
        };
        var manche = createNSsvg(xmlns, mancheShape, mancheAttributes);

        addSVG(tete);
        addSVG(manche);
    };

    // Fonction pour dessiner les fretes
    var drawFrete = function () {
        for (let i = 0; i<16; i++) {
            var frete = fretes(i, xmlns);
            addSVG(frete);
        }
        
        function fretes (spot, xmlns) {
            var thick = width*0.2/100;
            var gapOne = width*3/100;
            var gapAll = width*5.75/100*spot;
            var stretchTop = height*0.4/100*spot;
            var stretchBot = height*0.65/100*spot;
            var freteShape = 'line';
            var freteAttributes = {
                x1: x+gapOne+gapAll,
                y1: y1-stretchTop,
                x2: x+gapOne+gapAll,
                y2: y2+stretchBot,
                stroke: '#585858',
                'stroke-width': thick
            }
            if (spot == 0) {
                thick = width*0.5/100;
                freteAttributes['stroke'] = '#eee'
                freteAttributes['stroke-width'] = thick;
            }


            var frete = createNSsvg(xmlns, freteShape, freteAttributes);
            return frete;
        }
    };

    // Fonction pour dessiner les cordes
    var drawCorde = function () {
        for (let i=0.5; i<6; i++) {
            var corde = cordes(i, xmlns);
            addSVG(corde);
        }
        
        function cordes (spot, xmnls) {
            var thick = height*0.5/100;
            var gapLeft = (y2-y1)/6;
            var gapRight = height/6;
            var cordePath = "M0 " +  (y1+gapLeft*spot);
            cordePath += " L" + x + " " + (y1+gapLeft*spot);
            cordePath += " L" + width + " " + (gapRight*spot);
            cordePath += " L" + width + " " + (gapRight*spot+thick);
            cordePath += " L" + x + " " + (y1+gapLeft*spot+thick);
            cordePath += " L0 " + (y1+gapLeft*spot+thick) + " Z";
            var cordeAttributes = {
                d: cordePath,
                fill: "#fff"
            }
            var cordeShape = "path";
            var corde = createNSsvg(xmlns, cordeShape, cordeAttributes);
            return corde;
        }
    };

    var drawPoint = function () {
        for (let i = 1; i < 16; i++) {
            switch (i) {
                case 3: 
                    var point = points(i, xmlns);
                    point.setAttribute('transform', 'translate(0,'+ -(height*1.5/100) +')')
                    addSVG(point);
                    break;
                case 5: 
                    var point = points(i, xmlns);
                    point.setAttribute('transform', 'translate(0,'+ -(height*1/100) +')')
                    addSVG(point);
                    break;
                case 7: 
                    var point = points(i, xmlns);
                    point.setAttribute('transform', 'translate(0,'+ -(height*0.75/100) +')')
                    addSVG(point);
                    break;
                case 9: 
                    var point = points(i, xmlns);
                    point.setAttribute('transform', 'translate(0,'+ -(height*0.5/100) +')')
                    addSVG(point);
                    break;
                case 12: 
                    var point1 = points(i, xmlns);
                    var point2 = points(i, xmlns);
                    point1.setAttribute('transform', 'translate(0, ' + (height/4) + ')');
                    point2.setAttribute('transform', 'translate(0, '+ -(height/4) +')');
                    addSVG(point1);
                    addSVG(point2);
                    break;
                case 15: 
                    var point = points(i, xmlns);
                    addSVG(point);
                    break;
                default:
                    break;
            }
        }

        function points (spot, xmnls) {
            var cx = x + (width * 5.75/100)*spot;
            var cy = height/2;
            var rx = width * 1 / 100;
            var ry = ((y2 - y1)/6)/2;

            var noteShape = 'ellipse';
            var noteAttributes = {
                cx: cx,
                cy: cy,
                rx: rx,
                ry: ry,
                fill: '#555'
            }
            var note = createNSsvg(xmlns, noteShape, noteAttributes);
            return note;
        }
    }

    // Fonction pour reconstruire le dessin
    var redraw = function (guitare) {
        createSVG();
        getParams();
        drawFond();
        drawFrete();
        drawPoint();
        drawCorde();
        self.drawNote(guitare.notes);
        self.drawAccordage(guitare.accordage);
    }

    // --------------------------------------------------
    // ------------------ LES NOTES ---------------------
    // --------------------------------------------------

    // Fonction pour dessiner les notes du manche
    this.drawNote = function (notes) {
        var spot = 0;

        // Corde 1
        for (let i = 1; i < 16; i++) {
            var group = createNSsvg(xmlns, 'g', {
                class: 'note',
                id: 'note'+(spot+1)
            });
            var note = createNoteSVG(i);
            var text = createTextNote(i, notes[spot]);
            group.appendChild(note);
            group.appendChild(text);
            group.setAttribute('transform', 'translate(0, '+ -(0.35*height/100)*i +')');
            addSVG(group);
            group.style.display = 'none';
            spot++;
        }

        // Corde 2
        for (let i = 1; i < 16; i++) {
            var group = createNSsvg(xmlns, 'g', {
                class: 'note',
                id: 'note'+(spot+1)
            });
            var note = createNoteSVG(i);
            var text = createTextNote(i, notes[spot]);
            group.setAttribute('transform', 'translate(0,' + (((y2-y1)/6)-(0.175*height/100)*i) + ')');
            group.appendChild(note);
            group.appendChild(text);
            addSVG(group);
            group.style.display = 'none';
            spot++;
        }

        // Corde 3
        for (let i = 1; i < 16; i++) {
            var group = createNSsvg(xmlns, 'g', {
                class: 'note',
                id: 'note'+(spot+1)
            });
            var note = createNoteSVG(i);
            var text = createTextNote(i, notes[spot]);
            group.setAttribute('transform', 'translate(0,' + ((y2-y1)/6)*2 + ')');
            group.appendChild(note);
            group.appendChild(text);
            addSVG(group);
            group.style.display = 'none';
            spot++;
        }

        // Corde 4
        for (let i = 1; i < 16; i++) {
            var group = createNSsvg(xmlns, 'g', {
                class: 'note',
                id: 'note'+(spot+1)
            });
            var note = createNoteSVG(i);
            var text = createTextNote(i, notes[spot]);
            group.setAttribute('transform', 'translate(0,' + (((y2-y1)/6)*3+(0.175*height/100)*i) + ')');
            group.appendChild(note);
            group.appendChild(text);
            addSVG(group);
            group.style.display = 'none';
            spot++;
        }

        // Corde 5
        for (let i = 1; i < 16; i++) {
            var group = createNSsvg(xmlns, 'g', {
                class: 'note',
                id: 'note'+(spot+1)
            });
            var note = createNoteSVG(i);
            var text = createTextNote(i, notes[spot]);
            group.setAttribute('transform', 'translate(0,' + (((y2-y1)/6)*4+(0.325*height/100)*i) + ')');
            group.appendChild(note);
            group.appendChild(text);
            addSVG(group);
            group.style.display = 'none';
            spot++;
        }

        // Corde 6
        for (let i = 1; i < 16; i++) {
            var group = createNSsvg(xmlns, 'g', {
                class: 'note',
                id: 'note'+(spot+1)
            });
            var note = createNoteSVG(i);
            var text = createTextNote(i, notes[spot]);
            group.setAttribute('transform', 'translate(0,' + (((y2-y1)/6)*5+(0.5*height/100)*i) + ')');
            group.appendChild(note);
            group.appendChild(text);
            addSVG(group);
            group.style.display = 'none';
            spot++;
        }
        
    
        function createNoteSVG (spot) {
            var cx = x + (width * 5.75/100)*spot;
            var cy = ((y2 - y1)/6);
            var rx = width * 1.5 / 100;
            var ry = height * 6 / 100; 

            var noteShape = 'ellipse';
            var noteAttributes = {
                cx: cx,
                cy: cy,
                rx: rx,
                ry: ry,
                fill: 'red',
            }
            var note = createNSsvg(xmlns, noteShape, noteAttributes);
            return note;
        }

        function createTextNote (spot, val) {
            
            var newX = x + (width * 5.75/100)*spot;
            var y = (y2 - y1)/6 + height*2.5/100;
            var shape = 'text';
            var attr = {
                x: newX,
                y: y,
                'text-anchor': 'middle',
                'font-family': 'Verdana',
                'font-size': "18" 
            }
            var text = createNSsvg(xmlns, shape, attr);
            text.innerHTML = val;
            return text;
        }
    };

    // Fonction pour dessiner l'accordage
    this.drawAccordage = function (accordage) {
        for (let i = 0; i < accordage.length; i++) {
            var group = createNSsvg(xmlns, 'g', {
                class: 'accordage',
                id: 'accordage'+(i+1)
            });
            var shape = createShape(i+1);
            var text = createText(i+1, accordage[i]);
            group.appendChild(shape);
            group.appendChild(text);
            addSVG(group);
        }

        function createShape (spot) {
            var cx = x + (width*3/100)/2;
            var cy = (y2 - y1)/6*spot;
            var r = width * 0.75 / 100;

            var noteShape = 'circle';
            var noteAttributes = {
                cx: cx,
                cy: cy,
                r: r,
                fill: 'yellow',
                class: 'accordages'
            }
            var note = createNSsvg(xmlns, noteShape, noteAttributes);
            return note;
        }

        function createText (spot, val) {
            var newX = x + (width*3/100)/2;
            var y = (y2 - y1)/6*spot + (width * 1 / 100)/3;
            var shape = 'text';
            var attr = {
                x: newX,
                y: y,
                'text-anchor': 'middle',
                'font-family': 'Verdana',
                'font-size': "18" 
            }
            var text = createNSsvg(xmlns, shape, attr);
            text.innerHTML = val;
            return text;
        }
    };

    this.changeAccordage = function (accordage) {
        if (!accordage) return;
        var spot = 1;
        accordage.forEach(function (elem) {
            var shape = document.getElementById('accordage'+spot);
            var toChange = shape.childNodes[1];
            if (toChange.innerHTML != elem) {
                toChange.innerHTML = elem;
            }
            spot++;
        })
    };

    this.changeNotes = function (newNotes) {
        var spot = 1;
        newNotes.forEach(function (elem) {
            var shape = document.getElementById('note'+spot);
            var toChange = shape.childNodes[1];
            if (toChange.innerHTML != elem) {
                toChange.innerHTML = elem;
            }
            spot++;
        })
    };

    this.resizeSVG = function (e, guitare) {
        var parent = document.getElementById('svg');
        if (parent.childElementCount > 0) {
            while (parent.firstChild) {
                parent.removeChild(parent.firstChild);
            }
        }
        redraw(guitare);
    };

    this.doEvent = function (notes) {
        var allNotes = document.getElementsByClassName('note');
        console.log('notes: ', notes)
        for (let i = 0; i < allNotes.length; i++) {
            allNotes[i].addEventListener('mousedown', changeColor);
            allNotes[i].addEventListener('mouseup', function (e) {
                clearTimeout(timeID);
            })
        }
    }

    this.setNotes = function (newNotes) {
        notes = newNotes;
        console.log('notes: ', notes);
    }

    var changeColor = function (e) {
        var color = ['red', 'blue', 'yellow', 'green', 'purple'];
        var targ;
        if (e.target.nodeName != 'text') targ = e.target;
        else targ = e.target.previousSibling;

        var actual = targ.getAttribute('fill');
        var index = color.indexOf(actual);

        if (index == (color.length-1)) {
            targ.setAttribute('fill', color[0]);
        } else {
            targ.setAttribute('fill', color[index+1]);
        }
        
        timeID = setTimeout(function () {
            var name;
            if (e.target.nodeName == 'text') name = e.target.innerHTML;
            else name = e.target.nextSibling.innerHTML;
            console.log('name: ', name);

            notes[name].forEach(function (elem) {
                var parent = document.getElementById('note'+elem);
                targ = parent.firstChild;
                if (index == (color.length-1)) {
                    targ.setAttribute('fill', color[0]);
                } else {
                    targ.setAttribute('fill', color[index+1]);
                }            
            });
        }, 300);
    };

    this.initColor = function () {
        var parents = document.getElementsByClassName('note');
        parents = Array.from(parents);
        parents.forEach(function(elem) {
            elem.firstChild.setAttribute('fill', 'red');
        })
    };
};