// console.log("Start Tracking" + new Date());

var timer = new Timer();

function Timer() {
    this._domain = null;

    this._startTime = null;
    this._time = 0;
    this._storeTime = 0;
    this._idle = false;

    var self = this;
}

Timer.prototype._addTime = function () {
    var self = this;

    if (!self._domain || !self._startTime) {
        return;
    }
    var addTime = new Date() - self._startTime;
    var seconds = addTime / 1000;
    self._time += seconds;
    self._saveToStorage();

    return false;
};

Timer.prototype._setCurrent = function (domain) {
    var self = this;
    var Regexp = /^(\w+:\/\/[^\/]+).*$/;

    self._addTime();

    if (domain == null) {
        self._domain = null;
        self._time = 0;
        self._startTime = null;
        return false;
    }
    else {
        var d = domain.match(Regexp);
        if (d) {
            if (d[1] == self._domain) {
                self._startTime = new Date();
            }
            else {
                self._domain = d[1];
                self._startTime = new Date();
                self._time = 0;
            }
        }
    }
    return false;
};


Timer.prototype._updateCurrentFocusTab = function () {
    var self = this;

    //check whether the tabs are active in their windows
    // and whether the tabs are in the current window.
    chrome.tabs.query({active: true, lastFocusedWindow: true}, function (tabs) {
        //it should only have one tab.
        if (tabs.length == 1) {
            //Check if the window is focus.
            var domain = tabs[0].url;
            chrome.windows.get(tabs[0].windowId, function (window) {
                if (!window.focused) {
                    domain = null;
                }
                self._setCurrent(domain);
            });
        }
    });
    return false;
};


Timer.prototype._saveToStorage = function () {
    var self = this;
// http://stackoverflow.com/questions/11692699/
// chrome-storage-local-set-using-a-variable-key-name
    self._getFromStorage();
    var domainName = self._domain;
    var obj = {};


    var timeToStore = self._time + self._storeTime;
    obj[domainName] = timeToStore;
    chrome.storage.local.set(obj, function (result) {
        if (chrome.runtime.error) {
            console.log("Runtime error during Saving.");
        }
        else {
            console.log("Time Save Successfully.");
        }
    });
    return false;
};


Timer.prototype._getFromStorage = function () {
    var self = this;

    chrome.storage.local.get(null, function (items) {
        var size = items[self._domain];

        if (size == undefined) {
            self._storeTime = 0;
            return false;
        }
        else if (size == 0) {
            self._storeTime = 0;
            return false;
        }
        else {
            self._storeTime = size;
        }
    });
    return false;
};

module.exports = Timer;
