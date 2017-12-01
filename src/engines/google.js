"use strict";

//import h from "./helper.js";

export default function PrivacyGoogle(utils) {
    // var _data = {
    //     containerSelector: "#flex" // to place the UI
    // };

    //#region================ Private ===============================


    //#endregion


    //#region================ Public ================================

    this.Id = "google";
    this.Name = "Google";
    this.Pattern = /https?:\/\/(\w+\.)*?(google)\.\w+\//;   // which urls match this engine
    this.TrackAttr = ["onmousedown", "data-ctorig"]; // these attributes on links will be checked and removed by the default engine.
    this.Pref_Enabled = true;
    this.Pref_AllEvents = false;
    this.Pref_Own = true;

    this.isTracking = function (doc, link) {
        // Determine, whether a link is a tracking link.
        // The default implementations checks for any of this.TRACKATTR
        return utils.isTracking(doc, link);
    };

    this.hasBadHandler = function (doc, link) {
        // This is called, if the 'allevts' option is set, to check if a link
        // should be cleaned up.
        // Better leave this alone...
        return this.super.hasBadHandler(doc, link);
    };

    this.cloneLink = function (_doc, link) {
        // Create a copy of the original link. Below is a annotated version
        // of the default implementation
        // @change: You only need to implement this (and the next two methods),
        // If the modified web page looks particularly ugly.
        var neew = link.cloneNode(true);  // use DOM, copy children.
        // @change this if you need...
        neew.setIcon = function (elt) {
            // Will be called to insert those little icons somewhere in the DOM.
            // if you don't attach this function, this happens:
            utils.setIcon(neew, elt);
        };
        return neew;
    };

    this.createLinkAnnot = function (doc, trackedLink, wasReplaced) {
        // Create a HTML element that will hold the private (or original) link.
        // can attach a function 'setLink' where the private (or original) link
        // will be inserted (see 'setIcon' in 'cloneLink' above, or better, see
        // 'gpengines.jsm')
        // 'wasReplaced' indicates wheter the tracked link was replaced by the
        // private link, if you need this info.
        return utils.createLinkAnnot(doc, trackedLink, wasReplaced);
    };

    this.insertLinkAnnot = function (doc, link, annot) {
        // Insert the element created by 'createLinkAnnot' into the DOM.
        return this.super.insertLinkAnnot(doc, link, annot);
    };

    this.removeTracking = function (doc, privateLink, replaced) {
        // Remove or override all known tracking methods from a link
        // @change: This is probably the point where you want to start, if
        // adjusting this.TRACKATTR doesn't help
        // 'replaced' tells you, if the the private link replaced the tracked one
        return utils.removeTracking(doc, privateLink);
    };

    this.removeAll = function (doc, privateLink, replaced) {
        // This is called, if the 'allevts' option is set.
        // The default implementation remove all mouse, click and focus 
        // attributes and stops their atached event handling.
        // This may severely impair a webpage ;-)
        // 'replaced' tells you, if the the private link replaced the tracked one
        return this.super.removeAll(doc, privateLink, replaced);
    };

    this.removeGlobal = function (doc) {
        // If the webpage defines any tracking not attached to the links
        // (e.g. onClick-handlers on the document), you may remove or override
        // it here. The default does nothing.
        // Return true, if you found something
        return this.super.removeGlobal(doc);
    };

    this.replaceLink = function () {
        return utils.replaceLink();
    };

    this.close = function () {
        // perform cleanup if necessary
    };

    //#endregion=====================================================
}