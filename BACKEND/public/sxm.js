/**
 * SevenX Media — script do publisher (sxm.js)
 * ------------------------------------------------------------------
 * Instalado no site do publisher via:
 *   <script src="https://SEU-BACKEND/sxm.js" data-site="sxm_pub_xxx" async></script>
 *
 * O script é intencionalmente "burro": pergunta ao servidor qual ad
 * network servir (GET /collect/decide) e injeta a tag recebida.
 * Toda a lógica de seleção fica no servidor — nada proprietário aqui.
 */
(function () {
    'use strict';

    // Acha a própria tag <script> para ler data-site e a origem da API
    var el = document.currentScript;
    if (!el) {
        var candidates = document.querySelectorAll('script[data-site][src*="sxm.js"]');
        el = candidates[candidates.length - 1];
    }
    if (!el) return;

    var site = el.getAttribute('data-site');
    var src = el.getAttribute('src') || '';
    if (!site || !src) return;

    var api;
    try {
        api = new URL(src, window.location.href).origin;
    } catch (e) {
        return;
    }

    /**
     * Injeta o HTML da tag no fim do <body>. <script> inserido via
     * innerHTML não executa — cada um é recriado como elemento novo.
     */
    function injectTag(html) {
        var host = document.createElement('div');
        host.setAttribute('data-sxm', '');
        host.style.cssText = 'position:static';
        host.innerHTML = html;
        (document.body || document.documentElement).appendChild(host);

        var inert = host.querySelectorAll('script');
        for (var i = 0; i < inert.length; i++) {
            var old = inert[i];
            var fresh = document.createElement('script');
            for (var j = 0; j < old.attributes.length; j++) {
                fresh.setAttribute(old.attributes[j].name, old.attributes[j].value);
            }
            fresh.text = old.text || '';
            old.parentNode.replaceChild(fresh, old);
        }
    }

    function boot() {
        var url = api + '/collect/decide?site=' + encodeURIComponent(site);
        fetch(url, { method: 'GET', keepalive: true })
            .then(function (r) { return r.ok ? r.json() : null; })
            .then(function (d) {
                if (d && d.fill && d.tag) injectTag(d.tag);
            })
            .catch(function () { /* silencioso — nunca quebra o site do publisher */ });
    }

    if (document.body) {
        boot();
    } else {
        document.addEventListener('DOMContentLoaded', boot);
    }
})();
