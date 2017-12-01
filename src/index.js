"use strict";

console.log("htube " + new Date().getMinutes());
//node_modules\.bin\webpack --watch

require("../src/icon.png");
require("../src/style.css");
require("../src/manifest.json");

import privacy_google from "./engines/google.js";
import h from "./helper.js";
import u from "./utils.js";

function LinkPrivacy() {
    let _document, _window;
    let _engines = [privacy_google(u)];
    //     _player; // Youtube player

    // // The UI for setting replay status and timer
    // var _settingUI;

    // // Miscellaneous configuration data
    // var _data = {
    //     replay: false, // replay status
    //     replayUsingTime: false,
    //     duration: "00:00",
    //     quality: "small",
    //     replayInterval: null,
    //     prevUrl: ""
    // };

    // // Youtube API data
    // var YT = {
    //     PlayerState: {
    //         unstarted: -1,
    //         ended: 0,
    //         playing: 1,
    //         paused: 2,
    //         buffering: 3,
    //         video_cued: 5
    //     },
    //     PlayerStateClass: ["unstarted-mode", "ended-mode", "playing-mode", "paused-mode", "buffering-mode"]
    // };


    //#region================ Private ===============================

    function findEngine(enabledOnly, embedded) {
        if (_document == null) {
            return null;
        }

        let href = _document.location.href;

        // if (href.nodeType && href.nodeType == href.DOCUMENT_NODE) {
        //   doc = href;
        //   href = doc.location.href;
        // }

        for (let e in _engines) {
            if (!_engines.hasOwnProperty(e)) {
                continue;
            }
            let engine = _engines[e];

            if (enabledOnly && !engine.enabled) {
                continue;
            }

            if (href.match(engine.Pattern) != null) {
                return engine;
            }
        }

        if (embedded) {
            let frames = { i: _document.getElementsByTagName("iframe"), f: _document.getElementsByTagName("frame") };

            for (let what in frames)
                for (let f = 0; f < frames[what].length; f++) {
                    let emb = this.find(frames[what][f].contentDocument, enabledOnly, false);

                    if (emb != null) {
                        return emb;
                    }
                }
        }
        return null;
    }

    function onPageLoad(engine) {
        // if (this.auto) {
        privatize(engine);
        // }
    }

    function privatize(engine) {
        try {
            let self = this;
            // doc.gprivacyLoaded = new Date(); // a little bit of performance timing
            let links = _document.getElementsByTagName("a");
            let changed = 0;
            // let logged = !this.ifloggedin && eng.loggedIn(doc);

            for (let i = 0; i < links.length; i++) {
                changed += changeLink(eng, doc, links[i], self.replace, false, logged) ? 1 : 0;
            }

            changed += eng.removeGlobal(doc) ? 1 : 0;

            if (this.auto) {
                this.observeMutations(doc, function GP_oni(evt) { self.onNodeInserted(evt, eng); });
            } else {
                changed = changed || 1; // if links are already processed, avoid changemonitor warning
            }

            self.changemon.pageLoaded(eng, doc, links, changed);
        } catch (ex) {
            h.logException(ex);
        }
    }

    function _isTracking(eng, doc, link, forced) {
        if (forced) {
            return true;
        }

        if (eng.sameorigin && doc.location.hostname == link.hostname) {
            return false;
        }

        if (link.hostname == "" && !this.anonlinks) {
            return false;
        }
        let is = eng.isTracking(doc, link);

        if (eng.all) {
            return is || eng.hasBadHandler(doc, link);
        }
        return is;
    }

    function getWrapper() {
        return function (link) {
            if (!link.gprwapper) {
                link.gpwrapper = this;
                link.gpwatched = false;
            }
            return link;
        };
    }

    function changeLink(engine, doc, originalLink, replace, forced, loggedIn) {
        // if (!this.active) {
        //     return false;
        // }
        // let self = this;

        if (originalLink.hasAttribute("gprivacy")) {
            return false; // already handled
        }

        let verb = Services.prefs.getBoolPref("extensions.gprivacy.text") ||
            !Services.prefs.getBoolPref("extensions.gprivacy.mark");
        let wrap = getWrapper(engine, doc);


        let tracking = _isTracking(engine, doc, originalLink, forced);

        // // <ChangeMonitor>
        // if (!tracking && // do we watch this link anyway?
        //     (this.changemon.level & this.changemon.ALL) &&
        //     (originalLink.hostname != "" || this.anonlinks)) {
        //     let moni = wrap(originalLink), icon = this.DOMUtils.create(doc, this.MARKORIG);
        //     moni.setAttribute("gprivacy", "unknown"); // mark as visited
        //     icon.setAttribute("title", "Unknown...");
        //     if (this.seticons && !(this.changemon.level & this.changemon.SILENT))
        //         this._setIcons(eng, doc, moni, null, icon, null);
        //     this.changemon.watch(eng, doc, moni);
        // }
        // // </ChangeMonitor>

        if (!tracking) {
            return false; // maybe they're hiding too well...
        }

        let trackedLink = wrap(originalLink);
        let clonedLink = null;

        let modify = this.active && !loggedIn;

        if (modify) { // maybe we're logged in
            let annotation = null;

            clonedLink = wrap(engine.cloneLink(doc, trackedLink));

            if (!replace || this.keeporg) {
                annotation = engine.createLinkAnnot(doc, originalLink, replace);  // hold original link
            }

            let first = trackedLink;
            let second = clonedLink;

            if (replace) {
                engine.replaceLink(doc, trackedLink, clonedLink);
                first = clonedLink;
                second = trackedLink;
            }

            if (annotation !== null) {
                h.empty(second);

                if (verb) {
                    second.appendChild(replace ? doc.createTextNode(this.tracktext)
                        : doc.createTextNode(this.privtext));
                }
                engine.insertLinkAnnot(doc, first, annotation);

                if (annotation.setLink) {
                    annotation.setLink(second);
                }
                else {
                    annotation.appendChild(second);
                }
            }

            clonedLink.setAttribute("gprivacy", "true"); // mark as visited
        }

        //-------------------------------------------------------------------------
        // no for the important part...
        //-------------------------------------------------------------------------
        if (clonedLink) {
            removeTracking(engine, doc, clonedLink, replace);
        }

        // if (this.seticons) {
        //     let orgico = this.MARKORIG;
        //     if (!modify && loggedIn) {
        //         orgico = Object.create(this.MARKBOGUS);
        //         orgico.title = this.MARKORIG.title + " - " + this.loggedtext;
        //     }
        //     this._setIcons(engine, doc, clonedLink, trackedLink, this.MARKHTML, orgico);
        // }

        trackedLink.setAttribute("gprivacy", "false"); // mark as visited

        if (clonedLink) {
            // this.compat.fixPrivateLink(engine, doc, clonedLink);
            watch(engine, doc, clonedLink);
        }

        // if ((!clonedLink && modify) || this.changemon.level >= this.changemon.TRACKING)
        //     this.changemon.watch(engine, doc, trackedLink); // for engine developers

        return true;
    }

    function removeTracking(eng, doc, link, replaced) {
        let rc = null;

        if (eng.all) {
            rc = eng.removeAll(doc, link, replaced);
        }
        else {
            rc = eng.removeTracking(doc, link, replaced);
        }

        if (this.browserclick) {
            this.EventUtils.makeBrowserLinkClick(this.window, doc, link, true);
        }
        return rc;
    }

    function watch(eng, doc, link) {
        let self = this;
        const DPFX = "DO" + "M";

        if (this.active) {
            let mods = [DPFX + "Attr" + "Modified", DPFX + "Node" + "Inserted",
                        /* deprecated, I know: */ DPFX + "Subtree" + "Modified"];
            let status = {
                eng: eng, doc: doc, link: link,
                hit: false, notified: false, ignored: this.ignorerules
            }

            for (let m in mods) {
                link.addEventListener(mods[m], function (e) { self.onPrivacyCompromised(e, status); }, false, true);
            }

            link.gpwatched = true;
        }

        function onPrivacyCompromised(e, status) {
            let self = this;

            let link = e.currentTarget;

            if (link.gprivacyCompromised !== undefined && e.type == DOMSTM) // got it already
                return;

            let data = new MoniData(status.eng, status.doc, e);

            if (this.ignorerules.match(data) ||
                status.eng.changemonIgnored(status.doc, link, e) || // Engine said it's OK!
                e.type == this.gpr.INSERT_EVT) { // This is handled by gprivacy itself
                link.gprivacyCompromised = false;
                return;
            }

            link.gprivacyCompromised = true;

            let msg = status.eng + ": " + (link.id ? "#" + link.id + " " : "") + "'" + link.href +
                "' was compromised: " + e.type;

            if (e.attrChange) {
                if (e.prevValue == e.newValue) return; // Why are we getting those...

                msg += ", '" + e.attrName + "': '" +
                    e.prevValue + "' -> '" + e.newValue + "'";
            }

            if (link !== e.originalTarget &&
                link.getAttribute("gprivacy") == "false") { // monitoring tracking links means we're in debug mode
                this.warnLink("Maybe " + msg, false, data);
                return;
            }

            status.link = link;
            status.evt = e;

            if (!status.hit) {

                this.warnLink(msg, true, data);

                status.hit = true;
                if (link.gprivacyIcon) {
                    DOMUtils.setIcon(link, this.gpr.MARKBOGUS);
                }
                if (link.gprivacyText)
                    link.appendChild(status.doc.createTextNode("\u00A0(compromised!)"));
            }

            if (!status.notified) {
                status.notified = true;

                this.showPopup("gprmon-popup-tracking", msg + "'. See error log for details!",
                    null /* "gprmon-notification-icon" */, null, null, null);
            }
        }

        ////////////////General methods////////////////


        //#endregion=====================================================


        //#region================ Public ================================

        this.Create = function () {
            _document = window.wrappedJSObject.document;
            _window = _document.defaultView;

            // let self = this;
            // let evt = e;

            // TODO: load settings
            // this.loadPrefs();

            // if (!this.active) {
            //     return;
            // }

            // let doc = e.type != "DOMFrameContentLoaded" ?
            //     e.originalTarget :
            //     e.originalTarget.contentDocument;

            // this.compat.refresh(doc);
            // this.engines.refresh(doc);

            let engine = findEngine(true);

            if (engine != null) {
                h.debug(_document.location.href + "' matched engine: " + engine.Name);

                // this.changemon.refresh(doc, eng);

                let onLoad = function () {
                    _window.removeEventListener("load", onLoad, false);
                    onPageLoad(engine);
                };
                _window.addEventListener("load", onLoad, false);
            }
        };

        //#endregion
    }

    h.domReady(function () {
        // only trigger one
        if (!window.linkPrivacy) {
            window.linkPrivacy = new LinkPrivacy();
            window.linkPrivacy.Create();
        }
    });