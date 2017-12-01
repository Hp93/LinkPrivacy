// $Id: test_debug.js 72 2012-02-10 20:26:37Z hhofer69 $

"use strict";

var gpr = require("../lib/gprtests");

var setupModule = function (mod) {
  mod.ctlr    = mozmill.getBrowserController();

  gpr.refreshResults(mod.ctlr, null, "https://www.google.com/search?q=Wikipedia");

  mod.ctlr.window.alert("Gentlemen, start your debuggers!");
  debugger;
}
