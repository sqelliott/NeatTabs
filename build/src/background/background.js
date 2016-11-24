chrome.browserAction.onClicked.addListener(function (current_tab) {
    chrome.tabs.executeScript(null, {file: 'build/js/d3.js'});
    chrome.tabs.executeScript(null, {file: 'build/js/d3.min.js'});
    chrome.tabs.executeScript(null, {file: 'build/src/options_page/visual.js' });
});