/* =============================================================
   shared/play-counter.js — record a "play" (a coin inserted)
   -------------------------------------------------------------
   WHAT: studio-wide client for the votes/plays service. A game calls this
         when it is actually played, so the storefront's CREDITS counter
         reflects EVERY play regardless of how the player arrived (storefront
         click, direct link, bookmark, refresh).
   WHY fetch (not sendBeacon): the endpoint is Apps Script, which answers a
         POST with a 302 redirect. fetch follows it and completes; a beacon
         fired mid-navigation often does not -> dropped counts. So fire this
         on the game's own (stable) page load, not on a navigating click.
   FAILSAFE: fire-and-forget, no-cors, wrapped in try/catch. If the endpoint
         is down the game is unaffected (CLAUDE.md §3.3).
   USE (auto — recommended): in a game's entry page, before </body>:
         <script src="/shared/play-counter.js" data-game="ironline"></script>
   USE (manual):
         <script src="/shared/play-counter.js"></script>
         <script>WIA.recordPlay('ironline')</script>
   GAME KEYS (must match the storefront cabinet's data-game):
         ironline · firefly · sailing · pixelwar · warhammer · noodle · koi
   CONTRACT: POST { type:'play', game, ref, ts } to the votes/plays endpoint;
         the play is added to the "Plays" sheet (every coin counts, no dedupe).
   ============================================================= */
(function () {
  "use strict";
  var ENDPOINT = "https://script.google.com/macros/s/AKfycbxhPMZfmkxqGm7voeOop5xx0hl5NzIkAL1Vqx9ailW_nee1wwHgUWD2yRyMYZTvNA7i/exec";

  function recordPlay(game) {
    if (!game || !ENDPOINT) return;
    try {
      fetch(ENDPOINT, {
        method: "POST",
        mode: "no-cors",
        keepalive: true,
        body: new URLSearchParams({
          type: "play",
          game: game,
          ref: location.href,
          ts: new Date().toISOString()
        })
      });
    } catch (_) { /* failsafe: a dropped count must never break the game */ }
  }

  window.WIA = window.WIA || {};
  window.WIA.recordPlay = recordPlay;

  // auto-fire when included with a data-game attribute
  var self = document.currentScript;
  var auto = self && self.getAttribute("data-game");
  if (auto) recordPlay(auto);
})();
