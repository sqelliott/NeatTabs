//Object to save the url and time/start time
function TabsTimeTracker() {
    this._url = null;
    this._startTime = null;
    this._time = 0;
    var self = this;
    var idle = null;


//get the current time
// TabsTimeTracker.prototype.set_current_time = function (){
    //      var now = new Date();
    //    return now;
    //}

    //Fired when a tab is updated.
    chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
            //check if the url if still the current focus.
            console.log("onUpdated");
            self._updateCurrentFocusTab();
        }
    );

    //Fires when the active tab in a window changes. Note that the tab's
    // URL may not be set at the time this event fired, but you can listen
    // to onUpdated events to be notified when a URL is set.
    chrome.tabs.onActivated.addListener(
        function (activeInfo) {
            chrome.tabs.get(activeInfo.tabId, function (tab) {
                console.log("onActivated")
                self._updateCurrentFocusTab();
            });
        }
    );

    //Fired when the currently focused window changes.
    // Will be chrome.windows.WINDOW_ID_NONE if all chrome windows have lost focus.
    chrome.windows.onFocusChanged.addListener(
        function (windowId) {
            if (windowId == chrome.windows.WINDOW_ID_NONE) {
                console.log("Current Focus null")
                //self._setCurrentFocus(null);
                return;
            }
            console.log("onFocusChange");
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
            console.log("onStateChange");
            self._updateCurrentFocusTab();
        } else {
            idle = true;

            console.log("CurrentFocus null");
            //self._setCurrentFocus(null);
        }
    });

    chrome.alarms.create(
        "updateTime",
        {periodInMinutes: 1});
    chrome.alarms.onAlarm.addListener(function (alarm) {
        if (alarm.name == "updateTime") {

            if (!idle) {
                console.log("Update Current Focus time");
                self._updateCurrentFocusTab();
            }
            // Force a check of the idle state to ensure that we transition
            // back from idle to active as soon as possible.
            chrome.idle.queryState(60, function (idleState) {
                if (idleState == "active") {
                    idle = false;
                } else {
                    idle = true;
                    console.log("Current Focus = null")
                    //self._setCurrentFocus(null);
                }
            });
        }
    });

}



TabsTimeTracker.prototype._updateCurrentFocusTab = function () {


        var url;

        //console.log("inside return_active_focus");
        //  var Regexp = /^(\w+:\/\/[^\/]+).*$/;
        //check whether the tabs are active in their windows
        // and whether the tabs are in the current window.
        chrome.tabs.query({active: true, lastFocusedWindow: true}, function (tabs) {
            //it should only have one tab.
            if (tabs.length == 1) {

                url = tabs[0].url.match(Regexp);
                console.log("before windows.get : " + url[0])

                //Check if the window is focus.
                chrome.windows.get(tabs[0].windowId, function (window) {
                    console.log(window.focused);
                    if (!window.focused) {
                        url = null;
                        console.log("Current active/focused: NULL ");
                    }
                    // current_url;
                    set_active_focus(url);
                    console.log("Current active/focused: " + url[0]);
                });
            }
        });
        return false;
    };


    /*Enter current url to the the track_tabs array
     function track_tabs(url) {

     if (url.length>0 ){

     var url_time = new track_url(url[1], set_current_time());
     console.log("added to local storage : " + current_url_time._url +" "+ current_url_time._time);
     // save the current url object into track_tabs
     chrome.storage.local.set({"track_tabs": current_url_time}), function () {
     if (chrome.runtime.error) {
     console.log("Runtime error.");
     }
     else {
     console.log("Save to tracker Success.");
     }
     };
     }

     console.log("outside the loop");
     return false;
     }

     */

