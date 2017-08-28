window.onload = main();

function main () {
    manageTabs();

    var guitSvg = new drawGuitare();
    guitSvg.init();

    var guitare = new Guitare();
    guitare.init();


    guitSvg.drawNote(guitare.notes);
    guitSvg.drawAccordage(guitare.accordage);
    guitSvg.doEvent();
    guitare.doEvent(guitSvg);

    window.addEventListener('resize', function(e) {
        guitSvg.resizeSVG(e, guitare);
    });
}