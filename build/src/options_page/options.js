function save_options() {
    create_saved_table();
    var color = document.getElementById('color').value;
    var likesColor = document.getElementById('like').checked;
    chrome.storage.sync.set({
        favoriteColor: color,
        likesColor: likesColor
    }, function() {
        // Update status to let user know options were saved.
        var status = document.getElementById('status');
        status.textContent = 'Options saved.';
        setTimeout(function() {
            status.textContent = '';
        }, 750);
    });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
    // Use default value color = 'red' and likesColor = true.
    chrome.storage.sync.get({
        favoriteColor: 'red',
        likesColor: true
    }, function(items) {
        document.getElementById('color').value = items.favoriteColor;
        document.getElementById('like').checked = items.likesColor;
    });
}
// document.addEventListener('DOMContentLoaded', restore_options);

function start(tab) {
    chrome.windows.getCurrent(getWindows);
}

function getWindows(win) {
    targetWindow = win;
    chrome.tabs.getAllInWindow(targetWindow.id, getTabs);
}

function getTabs(tabs) {
    tabCount = tabs.length;
    // We require all the tab information to be populated.
    chrome.windows.getAll({"populate": true}, listTabs);
}

function listTabs(windows) {
    var test_table = document.getElementById("test_table");

    for (var i = 0; i < windows.length; i++) {
        var table = document.createElement("table");
        table.border = "1";

        for (var j = 0; j < windows[i].tabs.length; j++) {
            var tab = windows[i].tabs[j];

            var a = document.createElement('a');
            a.href = tab.url;
            a.appendChild(document.createTextNode(tab.title));
            a.setAttribute("title", tab.url);
            a.addEventListener('click', onAnchorClick);

            // Inserts created elements into the table in the HTML page
            var row = test_table.insertRow(-1);
            var cell1 = row.insertCell(0);
            var cell2 = row.insertCell(1);
            cell1.innerHTML = String(j + 1) + ".";
            cell2.appendChild(a);
            console.log(tab.url);
        }

        test_table.appendChild(table);
    }
}

function recent_callback(callback) {
    chrome.sessions.getRecentlyClosed(function (sessions) {
        callback(sessions);
    });
}

function create_saved_table() {
    var saved_tabs_table = document.getElementById("saved_tabs_table");
    console.log("here");
    chrome.storage.sync.get("saved_tabs", function (items) {
        console.log("lookhere");
        console.log(items.saved_tabs);
        for (var i = 0; i < items.saved_tabs.length; i++) {

            // Creates table elements along with tooltips
            var a = document.createElement('a');
            a.href = items.saved_tabs[i].url;
            a.appendChild(document.createTextNode(items.saved_tabs[i].title));
            a.setAttribute("title", items.saved_tabs[i].title);
            a.addEventListener('click', onAnchorClick);

            // EDITS
            //button to remove a tab from a save_tabs call
            /*var btn = document.createElement('p');
             btn.addEventListener("click",removeSaveTab);
             var btnText = document.createTextNode('X');
             btn.appendChild(btnText);*/

            // Inserts created elements into the table in the HTML page
            var row = saved_tabs_table.insertRow(i);
            var cell1 = row.insertCell(0);
            var cell2 = row.insertCell(1);
            // var cell3 = row.insertCell(2);
            cell1.innerHTML = String(i + 1) + ".";
            cell2.appendChild(a);
            /*cell3.appendChild(btn);*/
        }
    });
};

function init() {
    create_saved_table();
    // restore_options();
    recent_callback(create_recent_table);
    document.getElementById('history').addEventListener('click', function() {
        chrome.tabs.update({ url: 'chrome://chrome/history' });
    });
    document.getElementById('extensions').addEventListener('click', function() {
        chrome.tabs.update({ url: 'chrome://chrome/extensions' });
    });
    document.getElementById('settings').addEventListener('click', function() {
        chrome.tabs.update({ url: 'chrome://chrome/settings' });
    });
    document.getElementById('about').addEventListener('click', function() {
        chrome.tabs.update({ url: 'chrome://chrome/help' });
    });
    document.getElementById('save').addEventListener('click',
        save_options);
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);
recent_callback(create_recent_table);