"use strict";

import h from "./helper.js";

export default function ControlSetting() {
    var _data = {
        containerSelector: "#flex" // to place the UI
    };
    var _controlContainer, _settingContainer;
    var _element = {
        activeBtn: null,
        timerChb: null
    };
    var htmlTemplate =
        "<div class='htube'> \
            <div class='btn--active' title='Turn on replay'> \
                <span class=''> \
                    <span>Replay</span> \
                </span> \
            </div> \
            <div class='setting-container'> \
                <input class='setting-timerchk' type='checkbox' title='Enable timer' /> \
                From <input class='setting-from' type='text' /> To <input class='setting-to' type='text' /> \
            </div> \
            <div class='btn--open-setting' type='button'> \
                <svg width='100%' height='100%' viewBox='0 0 36 36'> \
                    <use class='ytp-svg-shadow' xlink:href='#ytp-id-19'></use> \
                    <path style='fill: rgb(136, 136, 136)' d='m 23.94,18.78 c .03,-0.25 .05,-0.51 .05,-0.78 0,-0.27 -0.02,-0.52 -0.05,-0.78 l 1.68,-1.32 c .15,-0.12 .19,-0.33 .09,-0.51 l -1.6,-2.76 c -0.09,-0.17 -0.31,-0.24 -0.48,-0.17 l -1.99,.8 c -0.41,-0.32 -0.86,-0.58 -1.35,-0.78 l -0.30,-2.12 c -0.02,-0.19 -0.19,-0.33 -0.39,-0.33 l -3.2,0 c -0.2,0 -0.36,.14 -0.39,.33 l -0.30,2.12 c -0.48,.2 -0.93,.47 -1.35,.78 l -1.99,-0.8 c -0.18,-0.07 -0.39,0 -0.48,.17 l -1.6,2.76 c -0.10,.17 -0.05,.39 .09,.51 l 1.68,1.32 c -0.03,.25 -0.05,.52 -0.05,.78 0,.26 .02,.52 .05,.78 l -1.68,1.32 c -0.15,.12 -0.19,.33 -0.09,.51 l 1.6,2.76 c .09,.17 .31,.24 .48,.17 l 1.99,-0.8 c .41,.32 .86,.58 1.35,.78 l .30,2.12 c .02,.19 .19,.33 .39,.33 l 3.2,0 c .2,0 .36,-0.14 .39,-0.33 l .30,-2.12 c .48,-0.2 .93,-0.47 1.35,-0.78 l 1.99,.8 c .18,.07 .39,0 .48,-0.17 l 1.6,-2.76 c .09,-0.17 .05,-0.39 -0.09,-0.51 l -1.68,-1.32 0,0 z m -5.94,2.01 c -1.54,0 -2.8,-1.25 -2.8,-2.8 0,-1.54 1.25,-2.8 2.8,-2.8 1.54,0 2.8,1.25 2.8,2.8 0,1.54 -1.25,2.8 -2.8,2.8 l 0,0 z' fill='#fff' id='ytp-id-19'></path> \
                </svg> \
            </div> \
        </div>";


    //#region================ Private ===============================

    function toggleReplay() {
        if (_element.activeBtn.classList.contains("active")) {
            disableReplay();
        } else {
            enableReplay();
        }
    }

    function enableReplay() {
        _element.activeBtn.classList.add("active");
        _element.activeBtn.setAttribute("title", "Turn off replay");
        h.triggerEvent(_controlContainer, "setting:replayChange", {
            state: true
        });
    }

    function disableReplay() {
        _element.activeBtn.classList.remove("active");
        _element.activeBtn.setAttribute("title", "Turn on replay");
        h.triggerEvent(_controlContainer, "setting:replayChange", {
            state: false
        });
    }

    function enableTimer() {
        // if (!_element.timerChb.checked) {
        _element.timerChb.checked = true;
        // }
        _settingContainer.classList.add("active");
        h.triggerEvent(_controlContainer, "setting:timeChange", {
            timer: true
        });
    }

    function disableTimer() {
        // if (_element.timerChb.checked) {
        _element.timerChb.checked = false;
        // }
        _settingContainer.classList.remove("active");
        h.triggerEvent(_controlContainer, "setting:timeChange", {
            timer: false
        });
    }

    function addEventHandler() {
        _controlContainer.querySelector(".btn--open-setting").addEventListener("click", function () {
            // var sc = _settingContainer.querySelector("span");

            if (_settingContainer.style["width"] === "0px" || _settingContainer.style["width"] === "") {
                // Move container back to normal position so it can be visible
                _settingContainer.style["width"] = "190px";
                // sc.querySelector(".setting-from").focus();   //TODO rewrite focus() in vanilla js
            } else {
                // Move container to the left, out of visible zone to hide it
                _settingContainer.style["width"] = "0px";
            }
        });

        document.querySelector(".setting-from").addEventListener("focusout", function (e) {
            h.triggerEvent(_controlContainer, "setting:settingFromChange", e.target.value);
        });

        document.querySelector(".setting-to").addEventListener("focusout", function (e) {
            h.triggerEvent(_controlContainer, "setting:settingToChange", e.target.value);
        });

        _controlContainer.querySelector(".btn--active").addEventListener("click", toggleReplay);

        _controlContainer.querySelector(".setting-timerchk").addEventListener("change", function (e) {
            if (e.target.checked) {
                enableTimer();
            } else {
                disableTimer();
            }
        });
    }

    function selectElements() {
        _settingContainer = document.querySelector(".setting-container");
        _element.activeBtn = _controlContainer.querySelector(".btn--active");
        _element.timerChb = _controlContainer.querySelector(".setting-timerchk");
    }

    //#endregion


    //#region================ Public ================================

    this.ToggleReplay = function (state) {
        if (state === undefined) {
            toggleReplay();
        }

        if (state) {
            enableReplay();
        } else {
            disableReplay();
        }
    };

    this.SetTime = function (from, to) {
        _controlContainer.querySelector(".setting-from").value = from;
        _controlContainer.querySelector(".setting-to").value = to;
        _controlContainer.querySelector(".setting-timerchk").checked = false;
    };

    this.ToggleTimer = function (state) {
        if (state) {
            enableTimer();
        } else {
            disableTimer();
        }
    };

    this.GetTime = function () {
        return {
            enable: _controlContainer.querySelector(".setting-timerchk").checked,
            from: _controlContainer.querySelector(".setting-from").value,
            to: _controlContainer.querySelector(".setting-to").value
        };
    };

    this.Create = function () {
        var ytContainer = document.querySelector(_data.containerSelector);

        if (!ytContainer) {
            return false;
        }

        _controlContainer = ytContainer.querySelector(".htube");

        if (_controlContainer) {
            selectElements();
        } else {
            h.prepend(ytContainer, h.createElement(htmlTemplate));
            _controlContainer = ytContainer.querySelector(".htube");
            selectElements();
            addEventHandler(); // only add event handler @ the first time create
        }

        this.ui = _controlContainer;
        return true;
    };

    //#endregion=====================================================
}