export default class {
    constructor() {
        this.debug = true;
    }

    static domReady(fn) {
        if (typeof fn !== "function") {
            return;
        }

        // in case the document is already rendered
        if (document.readyState != "loading") {
            fn();
        }
        // modern browsers
        else if (document.addEventListener) {
            document.addEventListener("DOMContentLoaded", fn);
        }
        // IE <= 8
        else {
            document.attachEvent("onreadystatechange", function () {
                if (document.readyState == "complete") {
                    fn();
                }
            });
        }
    }

    static triggerEvent(el, type, params) {
        var e = new CustomEvent(type, { detail: params });
        // e = document.createEvent("HTMLEvents");
        // e.initEvent(type, false, true);
        el.dispatchEvent(e);
    }

    static createElement(html) {
        var tmp = document.createElement("div");
        tmp.innerHTML = html;

        return tmp.childNodes.length === 1
            ? tmp.childNodes[0]
            : tmp.childNodes;
    }

    static prepend(currentNode, newNode) {
        if (currentNode.childNodes.length <= 0) {
            currentNode.insertBefore(newNode, null);
        } else {
            currentNode.insertBefore(newNode, currentNode.childNodes[0]);
        }
    }

    static empty(node) {
        while (node.hasChildNodes()) {
            node.removeChild(node.firstChild);
        }
    }

    static debug(text) {
        if (this.debug) {
            this.log("Debug: " + text);
        }
    }

    static logException(ex) {
        console.log(ex);
    }
}
