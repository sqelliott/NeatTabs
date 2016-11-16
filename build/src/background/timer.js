
console.log("hello");
//Object to save the url and time/start time
//setTimeout(TabsTimeTracker,1000);

var current_tab = new Timer();


function Timer() {
    this._tabs = null;
    this._startTime = null;
    this._time = 0;

    var self = this;
    var idle = null;



    //Fired when a tab is updated or when a new tab is created.
    chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
            //check if the url if still the current focus.
             self._updateCurrentFocusTab();
        }
    );


    //Fires when the active tab in a window changes. Note that the tab's
    // URL may not be set at the time this event fired, but you can listen
    // to onUpdated events to be notified when a URL is set.
    chrome.tabs.onActivated.addListener(
        function (activeInfo) {
            chrome.tabs.get(activeInfo.tabId, function (tab) {

                self._setCurrent(tab.urlgit );
            });
        }
    );

    //Fired when the currently focused window changes.
    // Will be chrome.windows.WINDOW_ID_NONE if all chrome windows have lost focus.
    chrome.windows.onFocusChanged.addListener(
        function (windowId) {
            if (windowId == chrome.windows.WINDOW_ID_NONE) {
                self._setCurrent(null);
                return;
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
            idle = false;

             self._updateCurrentFocusTab();
         } else {
            idle = true;
            self._setCurrent(null);
        }
     });

    //Alarm to check when the page goes idle.
    chrome.alarms.create("updateTime", {periodInMinutes: 1});
    chrome.alarms.onAlarm.addListener(function (alarm) {
        if (alarm.name == "updateTime") {

            if (!idle) {
                  self._updateCurrentFocusTab();
            }

            // The system is considered idle if detectionIntervalInSeconds
            // seconds have elapsed since the last user input detected.
            chrome.idle.queryState(60, function (idleState) {
                if (idleState == "active") {
                    idle = false;
                } else {
                    idle = true;
                   self._setCurrent(null);
                }
            });
        }
    });
}

Timer.prototype._addTime = function () {
    var self = this;
    if (!self._tabs || !self._startTime){
        return;
    }
    var now = new Date();
    var addTime = now - self._startTime;
    self._startTime = now;

    self._time = self._time + addTime;
    console.log("Adding = "+self._time/6000);

    //TODO:add save function
    return false;


}


Timer.prototype._setCurrent = function (tabs) {

    var self = this;
    console.log("tab: "+ tabs);
    self._addTime();
    if (tabs == null ){

        self._tabs = null;
        self._time = 0;
        console.log("in Null "+ self._time);
        self._startTime = null;
    }
    else {
        self._tabs = tabs;
        self._startTime = new Date();

    }

    console.log("setCurrent: " + self._tabs);
    return false;
}



Timer.prototype._updateCurrentFocusTab = function () {
   var self = this;

    var Regexp = /^(\w+:\/\/[^\/]+).*$/;
    //check whether the tabs are active in their windows
    // and whether the tabs are in the current window.
    chrome.tabs.query({active: true, lastFocusedWindow: true}, function (tabs) {
        //it should only have one tab.
        if (tabs.length == 1) {

                //Check if the window is focus.
                chrome.windows.get(tabs[0].windowId, function (window) {

                    if (!window.focused) {
                        self._setCurrent(null);
                    }
                    var url = tabs[0].url.match(Regexp);

                      self._setCurrent(url);

                });
            }

    });

    return false;
};

