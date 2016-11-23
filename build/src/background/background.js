var timer = new Timer();

//Fired when a tab is updated or when a new tab is created.
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo,tab){
        //check if the url if still the current focus.
        timer._updateCurrentFocusTab();
    }
);


//Fires when the active tab in a window changes. Note that the tab's
// URL may not be set at the time this event fired, but you can listen
// to onUpdated events to be notified when a URL is set.
chrome.tabs.onActivated.addListener(function (activeInfo) {
        chrome.tabs.get(activeInfo.tabId, function (tab) {

            timer._setCurrent(tab.url);
        });
    }
);

//Fired when the currently focused window changes.
// Will be chrome.windows.WINDOW_ID_NONE if all
// chrome windows have lost focus.
chrome.windows.onFocusChanged.addListener(function (windowId) {
        if (windowId == chrome.windows.WINDOW_ID_NONE) {
            timer._setCurrent(null);
            return false;
        }
        timer._updateCurrentFocusTab();
    }
);

//Fired when the system changes to an active, idle or locked state.
// The event fires with "locked" if the screen is locked or the
// screensaver activates, "idle" if the system is unlocked and the
// user has not generated any input for a specified number of seconds,
// and "active" when the user generates input on an idle system.
chrome.idle.onStateChanged.addListener(function (idleState) {
    if (idleState == "active") {
        timer._idle = false;
        timer._updateCurrentFocusTab();
    }
    else {
        timer._idle = true;
        timer._setCurrent(null);
    }
});

//Alarm to check when the page goes idle.
chrome.alarms.create("updateTimer", {periodInMinutes: 1});
chrome.alarms.onAlarm.addListener(function (alarm) {
    if (alarm.name == "updateTimer") {

        if (!timer._idle) {
            timer._updateCurrentFocusTab();
        }
        // The system is considered idle if detectionIntervalInSeconds
        // seconds have elapsed since the last user input detected.
        chrome.idle.queryState(60, function (idleState) {
            if (idleState == "active") {
                timer._idle = false;
            } else {
                timer._idle = true;
                timer._setCurrent(null);
            }
        });
    }
});