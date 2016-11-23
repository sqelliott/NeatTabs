// Control tabs to be saved by user
current_tabs_bitVector = new Array();

function init() {
    console.log("Starting Logging");
    return_callback(create_current_table);

    document.getElementById("save_menu").addEventListener("click", function () {
        console.log("Saving Session.");
        return_callback(save_tabs);
    });
    document.getElementById("restore_menu").addEventListener("click", function () {
        console.log("Restoring Session.");
        restore_tabs();
    });
    document.getElementById("clear_menu").addEventListener("click", function () {
        console.log("Clearing Session.");
        clear_storage();
    });
    document.getElementById("options_menu").addEventListener("click", function () {
        console.log("Opening Options.");
        chrome.tabs.create({url: "src/options_page/options.html"});
    });
    document.getElementById("export_menu").addEventListener("click", function () {
        console.log("Exporting Session.");
        restore_callback(export_tabs);
    });
}


function create_current_table(tabs) {
    var current_tabs_table = document.getElementById("current_tabs_table");
    for (var i = 0; i < tabs.length; i++) {
        // initial current_tabs_bitVector
        // to save all tabs
        current_tabs_bitVector[i] = 1;
        // console.log(tabs);
        // Creates table elements along with tooltips
        var a = document.createElement('a');
        a.href = tabs[i].url;
        a.appendChild(document.createTextNode(tabs[i].title));
        a.setAttribute("title", tabs[i].url);
        a.addEventListener('click', onAnchorClick);

        //button to exclude a tab from a save_tabs call
        var btn = document.createElement('BUTTON');
        btn.addEventListener("click", excludeCurrentTab);
        btn.className = "btn btn-primary btn-sm";

        var btnText = document.createTextNode('Exclude');
        btn.appendChild(btnText);

        var favicon = document.createElement('img');
        favicon.rel = 'shortcut icon';
        favicon.src = tabs[i].favIconUrl;
        favicon.type = 'image/x-icon';
        favicon.width = "20";

        // Inserts created elements into the table in the HTML page
        var row = current_tabs_table.insertRow(i);
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        var cell4 = row.insertCell(3);
        cell3.appendChild(favicon);
        cell1.innerHTML = String(i + 1) + ".";
        cell2.appendChild(a);
        cell4.appendChild(btn);
    }
}

function create_saved_table() {
    var saved_tabs_table = document.getElementById("saved_tabs_table");
    destroy_saved_table();

    chrome.storage.local.get("saved_tabs", function (items) {
        console.log("saved table");
        console.log(items.saved_tabs);
        for (var i = 0; i < items.saved_tabs.length; i++) {

            // Creates table elements along with tooltips
            var a = document.createElement('a');
            a.href = items.saved_tabs[i].url;
            a.appendChild(document.createTextNode(items.saved_tabs[i].title));
            a.setAttribute("title", items.saved_tabs[i].title);
            a.addEventListener('click', onAnchorClick);

            var favicon = document.createElement('img');
            favicon.rel = 'shortcut icon';
            console.log(items);
            favicon.src = items.saved_tabs[i].favIconUrl;
            favicon.type = 'image/x-icon';
            favicon.width = "20";

            //button to exclude a tab from a save_tabs call
            var btn = document.createElement('BUTTON');
            btn.addEventListener("click", removeSaveTab);
            btn.className = "btn btn-primary btn-sm";
            var btnText = document.createTextNode('Remove');
            btn.appendChild(btnText);

            // Inserts created elements into the table in the HTML page
            var row = saved_tabs_table.insertRow(i);
            var cell1 = row.insertCell(0);
            var cell2 = row.insertCell(1);
            var cell3 = row.insertCell(2);
            var cell4 = row.insertCell(3);
            cell1.innerHTML = String(i + 1) + ".";
            cell2.appendChild(a);
            cell3.appendChild(favicon);
            cell4.appendChild(btn);
        }
    });
}

function destroy_saved_table() {
    var saved_tabs_table = document.getElementById("saved_tabs_table");

    while (saved_tabs_table.rows.length > 0) {
        saved_tabs_table.deleteRow(0);
    }
    console.log("saved_table destroyed");
}


// Callback function for returning URL object
// https://stackoverflow.com/questions/19170595/putting-chrome-tabs-query-in-a-function-always-returns-undefined
function return_callback(callback) {
    chrome.tabs.query({}, function (tabs) {
        callback(tabs);
    });
}

function restore_callback(callback) {
    chrome.storage.local.get("saved_tabs", function (items) {
        callback(items);
    });
}

function recent_callback(callback) {
    chrome.sessions.getRecentlyClosed(function (sessions) {
        callback(sessions);
    });
}

// Saves only tab urls
function save_tabs(tabs) {
    console.log("Executing save_tabs(tabs0 function");
    console.log(tabs);
    var saved_tabs = new Array();
    for (var i = 0, j = 0; i < tabs.length; i++) {
        if (current_tabs_bitVector[i]) {
            saved_tabs[j] = tabs[i];
            j++;
        }
    }

    chrome.storage.local.set({"saved_tabs": saved_tabs}), function () {
        if (chrome.runtime.error) {
            console.log("Runtime error.");
        }
        else {
            console.log("Save Success.");
        }
    };
    create_saved_table();
}

// Clears local storage
function clear_storage() {
    chrome.storage.local.clear();
    console.log("storage cleared");
    destroy_saved_table();
}

// Function to reopen all saved tabs in a new window
function restore_tabs() {
    chrome.storage.local.get("saved_tabs", function (items) {
        console.log(items);
        // chrome.windows.create({focused: true, url: items.saved_tabs});

        var urls = [];
        for (var i = 0; i < items.saved_tabs.length; i++) {
            urls[i] = items.saved_tabs[i].url;
        }
        chrome.windows.create({focused: true, url: urls});
    });
}

// Function to export all saved tabs to a .csv file
function export_tabs(items) {
    console.log('saving' + items);
    var result = '';
    for (var i = 0; i < items.saved_tabs.length; i++) {
        console.log(items.saved_tabs[i].url);
        result += items.saved_tabs[i].url.toString() + ',';
    }
    var download_link = document.createElement("a");
    download_link.href = "data:text/csv," + result;
    console.log(download_link);

    chrome.downloads.download({
        url: download_link.toString(),
        filename: 'export.csv'
    });
}

// Event listener for clicks on links in a browser action popup.
// Open the link in a new tab of the current window.
function onAnchorClick(event) {
    chrome.tabs.create({url: event.srcElement.href});
    console.log(event.srcElement.toString());
    return false;
}

// Event listener for clicks on current tabs button
// Select a tab that user does not want to save
function excludeCurrentTab(event) {
    var current_tabs_table = document.getElementById("current_tabs_table");
    var btn = event.srcElement;
    var btnChild = btn.childNodes;
    btn.removeChild(btn.childNodes[0]);

    var row = event.srcElement.parentNode.parentNode;
    var rowInd = row.rowIndex;

    if (current_tabs_bitVector[rowInd] == 1) {
        current_tabs_bitVector[rowInd] = 0;
        var btnText = document.createTextNode("Include");
        btn.appendChild(btnText);
        btn.className = "btn btn-danger btn-sm";
        console.log("exclude " + (rowInd + 1) + " from current_tabs_table");
    }
    else {
        current_tabs_bitVector[rowInd] = 1;
        var btnText = document.createTextNode("Exclude");
        btn.appendChild(btnText);
        btn.className = "btn btn-primary btn-sm";
        console.log("Include " + (rowInd + 1) + " from current_tabs_table");
    }
}


function removeSaveTab(event) {
    var saved_tabs_table = document.getElementById("saved_tabs_table");

    // get the button that sevent event listener to remove tabs
    var btn = event.srcElement;

    // get the row of the button
    // identify the row number of the button's row
    var row = btn.parentNode.parentNode;
    var rowInd = row.rowIndex;


    chrome.storage.local.get("saved_tabs", function (items) {
        items.saved_tabs.splice(rowInd, 1);

        console.log("updated saved_tabs");
        console.log(items.saved_tabs);

        if (items.saved_tabs.length == 0) {
            console.log("session has no tabs");
            // based on code of 1 session saved
            clear_storage();
        } else {
            chrome.storage.local.set({"saved_tabs": items.saved_tabs}, function () {
                if (chrome.runtime.error) {
                    console.log("Runtime error.");
                }
                else {
                    console.log("Save Success.");
                    console.log("old saved_tabs_table removed");
                    destroy_saved_table();
                    create_saved_table();
                }
            });
        }
    });
}

// Initialization routine
document.addEventListener('DOMContentLoaded', init);

module.exports = Popup;