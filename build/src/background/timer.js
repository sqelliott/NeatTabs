
console.log("Start Tracking"+ new Date());


var timer = new Timer();


function Timer() {
    this._domain = null;

    this._startTime = null;
    this._time = 0;
    this._storeTime = 0;
    this._idle = false;

    var self = this;




    //Fired when a tab is updated or when a new tab is created.
    chrome.tabs.onUpdated.addListener(function(tabId, changeInfo,tab){
            //check if the url if still the current focus.
             self._updateCurrentFocusTab();
        }
    );


    //Fires when the active tab in a window changes. Note that the tab's
    // URL may not be set at the time this event fired, but you can listen
    // to onUpdated events to be notified when a URL is set.
    chrome.tabs.onActivated.addListener(function (activeInfo) {
            chrome.tabs.get(activeInfo.tabId, function (tab) {

                self._setCurrent(tab.url);
            });
        }
    );

    //Fired when the currently focused window changes.
    // Will be chrome.windows.WINDOW_ID_NONE if all
    // chrome windows have lost focus.
    chrome.windows.onFocusChanged.addListener(function (windowId) {
            if (windowId == chrome.windows.WINDOW_ID_NONE) {
                self._setCurrent(null);
                return false;
            }
             self._updateCurrentFocusTab();
        }
    );

    //Fired when the system changes to an active, idle or locked state.
    // The event fires with "locked" if the screen is locked or the
    // screensaver activates, "idle" if the system is unlocked and the
    // user has not generated any input for a specified number of seconds,
    // and "active" when the user generates input on an idle system.
     chrome.idle.onStateChanged.addListener(function (idleState) {
        if (idleState == "active") {
            self._idle = false;
             self._updateCurrentFocusTab();
         }
         else {
            self._idle = true;
            self._setCurrent(null);
        }
     });

    //Alarm to check when the page goes idle.
    chrome.alarms.create("updateTimer", {periodInMinutes: 1});
    chrome.alarms.onAlarm.addListener(function (alarm) {
        if (alarm.name == "updateTimer") {

            if (!self._idle) {
                  self._updateCurrentFocusTab();
            }
            // The system is considered idle if detectionIntervalInSeconds
            // seconds have elapsed since the last user input detected.
            chrome.idle.queryState(60, function (idleState) {
                if (idleState == "active") {
                    self._idle = false;
                } else {
                    self._idle = true;
                   self._setCurrent(null);
                }
            });
        }
    });
}



Timer.prototype._addTime = function () {
    var self = this;

    if (!self._domain || !self._startTime){
        return ;
    }

    var addTime = new Date() - self._startTime;
    var seconds = addTime/1000;

    self._time += seconds;


    return false;
}


Timer.prototype._setCurrent = function (domain) {

    var self = this;
    var Regexp =  /^(\w+:\/\/[^\/]+).*$/;

    self._addTime();

    if (domain == null ){
        self._domain = null;
        self._time = 0;
        self._startTime = null;
        console.log("Current: "+ self._domain+" "+ self._time);
        return ;
    }
    else {
        var d = domain.match(Regexp);

        if (d) {

            if(d[1] == self._domain) {
                self._startTime = new Date();
            }
            else{
                self._saveToStorage();
                self._domain = d[1];
                self._startTime = new Date();
                self._time = 0;

            }
        }
    }
    console.log("Current: "+ self._domain+" "+ self._time);
    return false;
}



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
                        domain =null;
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
    var obj={};


    var timeToStore = self._time + self._storeTime;
   console.log(timeToStore);
    obj[domainName] = timeToStore;
    chrome.storage.local.set(obj,function (result) {
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
        var size = items[self._domain] ;
         console.log(items[self._domain]);

        if (size == undefined){
            self._storeTime = 0;
            return false;
        }
        else if (size == 0){
            self._storeTime =0;
            //self._inStorage = false;
          return false;
        }
        else {
            self._storeTime = size;
        }
    });
    return false;
};