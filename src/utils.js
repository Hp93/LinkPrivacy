"use strict";

export default function PrivacyGoogle() {

    this.isTracking = function (link) {
        let is = false;

        for (let a in this.TrackAttr) {
            if (!this.TrackAttr.hasOwnProperty(a)) {
                continue;
            }

            if (link.hasAttribute(this.TrackAttr[a])) {
                is = true;
                break;
                // if (!this.gpr.DEBUG) {
                //     break;
                // }
                // this.gpr.debug(this.TRACKATTR[i] + ": <" + link.href + "> " + link.getAttribute(this.TRACKATTR[i]));
            }
        }
        return is;
    };

    this.setIcon = function (elt, icon, append) {
        let isSet = elt.getAttribute("gpr-icon");
        let usecss = null;

        // if there's no CSS-image or we didn't or don't want to append, use CSS
        if (!append && isSet != "dom") {
            usecss = elt.ownerDocument.defaultView.getComputedStyle(elt);

            if (isSet == null && usecss.backgroundImage != "none")
                usecss = null;
        }

        if (usecss) {
            setIconCSS(elt, icon, usecss);
        }
        else {
            setIconDOM(elt, icon);
        }
    };

    this.createLinkAnnot = function (doc) {
        let lclass = "gl";

        if (this.LINK_CLASS) {
            lclass = this.LINK_CLASS;
        }
        let lstyle = null;

        if (this.LINK_STYLE) {
            lstyle = this.LINK_STYLE;
        }

        let span = create(doc, { node: "span", class: lclass, style: lstyle });
        // if this is prettier than span.innerHTML = "&nbsp;-&nbsp;"; ???
        // but if it makes reviewers happy...
        span.appendChild(doc.createTextNode("\u00A0-\u00A0"));
        span.setLink = function (link) {
            this.appendChild(link);
        };
        return span;
    };

    this.replaceLink = function (_doc, link, neew) {
        return link.parentNode.replaceChild(neew, link);
    };

    this.removeTracking = function (_doc, link) {
        for (let i in this.TRACKATTR) {
            if (link.hasAttribute(this.TRACKATTR[i]))
                link.removeAttribute(this.TRACKATTR[i]);
        }
        let evts = getEvents(link);

        if ("mousedown" in evts) {
            stopEvent("mousedown", link);
        }
    };

    this.removeAll = function (_doc, link) {
        let evts = getEvents(link) || {};

        for (let i = 0; i < this.BAD_EVENTS.length; i++) {
            let evt = this.BAD_EVENTS[i];

            if (evt in evts) {
                stopEvent(evt, link);
                this.gpr.debug("Removed '" + evt + "' handler from '" + link.href + "'");
            }

            if (link.hasAttribute("on" + evt)) {
                link.removeAttribute("on" + evt);
                this.gpr.debug("Removed 'on" + evt + "' from '" + link.href + "'");
            }
        }
    };



    function setIconCSS(elt, icon, oldStyle) {
        let nstyle = elt.cloneNode(false).style; // avoid reflows/redraws
        nstyle.background = "url('" + icon.src + "') " + "no-repeat scroll right center transparent";
        nstyle.backgroundSize = icon.width + "px " + icon.height + "px";

        if (elt.getAttribute("gpr-icon") != "css") {
            let pad = icon.width + 1;

            if (oldStyle && oldStyle.paddingRight != "") {
                pad += parseInt(oldStyle.paddingRight.replace(/px/, ""));
            }
            nstyle.paddingRight = pad + "px";
            elt.setAttribute("gpr-icon", "css");
            let title = icon.title || (icon.getAttribute && icon.getAttribute("title"));

            if (title && !elt.hasAttribute("title")) {
                elt.setAttribute("title", title);
            }
        }
        elt.style.cssText = nstyle.cssText;
    }

    function setIconDOM(elt, icon) {
        if (icon.isTemplate) {
            icon = create(elt.ownerDocument, icon);
        }

        if (elt.gprivacyIcon) {
            elt.gprivacyIcon.parentNode.insertBefore(icon, elt.gprivacyIcon);
            elt.gprivacyIcon.parentNode.removeChild(elt.gprivacyIcon);
        } else {
            elt.appendChild(icon);
        }
        elt.gprivacyIcon = icon;
        elt.setAttribute("gpr-icon", "dom");
    }

    function create(doc, def) {
        // well, now that I removed all innerHTMLs, the validator complains
        // about the variable node type in createElement(def.node)!
        // I cannot see, what should be illegal in this! Hardcoding everything
        // is certainly _NOT_ a step in the right direction!
        // So don't blame me for this silly piece of code - and please, don't
        // put it on the Daily WTF <http://thedailywtf.com/Series/CodeSOD.aspx>
        let elt = null;

        switch (def.node) {
            case "a": elt = doc.createElement("a"); break;
            case "img": elt = doc.createElement("img"); break;
            case "span": elt = doc.createElement("span"); break;
            default: {
                let e = new Error("Unknown DOM Element");
                // e.info = Logging.callerInfo(1);
                throw e;
            }
        }

        for (let attr in def) {
            if (attr != "node") {
                elt.setAttribute(attr, def[attr]);
            }
        }
        return elt;
    }

    function stopEvent(type, element, eventCapturing) {
        let self = this; // generate closure
        eventCapturing = !!eventCapturing;
        element.addEventListener(type, function (e) { self.stopThis(e); }, eventCapturing, true);
    }

    function getEvents(elt) {
        if (this.els == null)
            return null;
        let evts = {};
        let infos = this.els.getListenerInfoFor(elt);
        for (let i = 0; i < infos.length; i++)
            if (typeof evts[infos[i].type] == "undefined")
                evts[infos[i].type] = 1;
            else
                evts[infos[i].type] += 1
        return evts;
    }
}