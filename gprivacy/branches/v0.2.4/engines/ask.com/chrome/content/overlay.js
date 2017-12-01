// $Id: overlay.js 72 2012-02-10 20:26:37Z hhofer69 $

"use strict";

// Overlays connot be used yet: https://bugzilla.mozilla.org/show_bug.cgi?id=675387
// But for a bootstrapped extension, this file will be obsolete anyway...
// See bootstrap.js

/*

Components.utils.import("chrome://gprivacy/content/gpengines.jsm");
Components.utils.import("chrome://gprask/content/engine.jsm");

var gprask = {
  // Just load our engine and add it to gprivacy
  onLoad: function() {
    // @change this to match your EXPORTED_SYMBOLS in engine.jsm
    gprivacy.engines.add(new gprivacyAsk(Engines));
  }
}

window.addEventListener("load", function () { gprask.onLoad(); }, false);

*/
