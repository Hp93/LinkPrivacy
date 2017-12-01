// $Id: google.jsm 95 2012-06-22 10:16:36Z hhofer69@gmail.com $

"use strict";

Components.utils.import("resource://gre/modules/Services.jsm");
Components.utils.import("chrome://gprivacy/content/gputils.jsm");

var EXPORTED_SYMBOLS = [ "gprivacyGoogle" ];

function gprivacyGoogle(engines) {
  this.engines = engines;
  this.gpr     = engines.gpr;
  this.strings = this.gpr.strings;
  this.PATTERN = /https?:\/\/((?!(maps|code|(plusone)))\w+\.)*?(google)(.com?)?\.\w+\//
}

gprivacyGoogle.prototype = {
  ID:        "google",
  NAME:      "Google",
  TRACKATTR:  [ "onmousedown", "data-ctorig" ],
  
  loggedIn: function GG_loggedIn(doc) {
    return doc.getElementById("gbi4")   != null ||   // old style (no +)
           doc.getElementById("gbi4i")  != null      // new style (with image)
  },
  
  isTracking: function GG_isTracking(doc, link) {
    return this.super.isTracking(doc, link) ||
           (doc.location.hostname &&
            doc.location.hostname.match(/^news\./) &&
            link.hasAttribute("url"))
  },
  
  removeTracking: function GG_removeTracking(doc, link, replaced) {
  
    if (doc.location.hostname.match(/^news\./)) {
      link.classList.add("_tracked"); // as simple as that?
      return;
    }
    this.super.removeTracking(doc, link);
  }
  
  // <ChangeMonitor>
  ,
  removeGlobal: function GG_removeGlobal(doc) {
    if (this.changemonIgnored(doc, null, null))
      // no search result on page. probably google home page so ignore and...
      return 1; // ...make ChangeMonitor happy
    return 0;
  },
  
  changemonIgnored: function GG_changemonIgnored(doc, link, e) { // don't warn on certain pages without hits
    // TODO: think of a proper policy mechanism, used by other engines too
    var ignored = false;
    if (link == null || e == null) { // whole document
      ignored = (
        // Account login
           ( doc.location.pathname == "/ServiceLogin" )
        // google search home without results
        || ( doc.getElementById("gsr") != null && doc.getElementById("cnt") == null )
        // iframe with Google+ notification
        || ( doc.getElementById("nw-content")  && doc.getElementById("notify-widget-pane") )
        // Image search links are tracked, anyway
        || ( doc.location.search.match(/(&|\?)tbm=isch&?/g) )
      );
    }
    if (!ignored && e && e.attrChange) {
      if (e.attrName == "href" || e.attrName == "src") {
        ignored = link.search.match(/(&|\?)tbm=isch&?/g);
      } else if (e.attrName == "class") {
        ignored = ( 
          (link.id.match(/^gb.*$/) &&
           e.prevValue.replace(/\s*gb[gmz](t-hvr|0l)\s*/g, '') ==
           e.newValue.replace( /\s*gb[gmz](t-hvr|0l)\s*/g, ''))
        );
      }
    }
    if (ignored)
      this.gpr.debug(this+": ignoring unchanged ' "+(link?"link":"page")+" "+doc.location.href.substring(0, 128)+"'"); 
    return ignored;
  }
  // </ChangeMonitor>
  
};
