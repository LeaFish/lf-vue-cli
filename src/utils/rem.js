var setRem = function(baseWidth = 375){
    (function(doc, win) {
        var docEl = doc.documentElement,
            resizeEvt = 'orientationchange' in window ? 'orientationchange': 'resize';
        docEl.dataset.dpr = win.devicePixelRatio;
        var recalc = function() {
            var clientWidth = docEl.clientWidth;
            if (!clientWidth) return;
            docEl.style.fontSize = 100 * (clientWidth / baseWidth) + 'px';
            doc.body.style["opacity"] = 1;
            if (clientWidth < baseWidth) docEl.style.fontSize = 100 + 'px';
        };
        if (!doc.addEventListener) return;
        win.addEventListener(resizeEvt, recalc, false);
        doc.addEventListener('DOMContentLoaded', recalc, false);
    })(document, window);
};
