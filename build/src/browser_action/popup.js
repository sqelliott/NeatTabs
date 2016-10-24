// Initialization function

console = chrome.extension.getBackgroundPage().console;

function init() {
    console.log("Starting Logging");

    return_callback(create_current_table);
    create_saved_table();

    document.getElementById("current_tabs").addEventListener("click", function () {
        console.log("Showing Current Tabs.");
        var saved_tabs_table = document.getElementById("saved_tabs_table");
        var current_tabs_table = document.getElementById("current_tabs_table");

        saved_tabs_table.style.display = "none";
        current_tabs_table.style.display = "";
    });

    document.getElementById("saved_tabs").addEventListener("click", function () {
        console.log("Showing Saved Tabs.");
        var saved_tabs_table = document.getElementById("saved_tabs_table");
        var current_tabs_table = document.getElementById("current_tabs_table");

        saved_tabs_table.style.display = "";
        current_tabs_table.style.display = "none";

    });

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
        console.log("Options Menu.");
        chrome.tabs.create({url: "src/options_custom/index.html"});
    });
    document.getElementById("export_menu").addEventListener("click", function () {
        console.log("Options Menu.");
        restore_callback(export_tabs);
    });
}

function create_current_table(tabs) {
    var current_tabs_table = document.getElementById("current_tabs_table");

    for (var i = 0; i < tabs.length; i++) {
        // Creates table elements along with tooltips
        var a = document.createElement('a');
        a.href = tabs[i].url;
        a.appendChild(document.createTextNode(tabs[i].title));
        a.setAttribute("title", tabs[i].url);
        a.addEventListener('click', onAnchorClick);

        // Inserts created elements into the table in the HTML page
        var row = current_tabs_table.insertRow(i);
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        cell1.innerHTML = String(i + 1) + ".";
        cell2.appendChild(a);
    }
};

function create_saved_table() {
    var saved_tabs_table = document.getElementById("saved_tabs_table");

    chrome.storage.sync.get("saved_tabs", function (items) {
        console.log(items.saved_tabs);
        for (var i = 0; i < items.saved_tabs.length; i++) {
            // Creates table elements along with tooltips
            var a = document.createElement('a');
            a.href = items.saved_tabs[i];
            a.appendChild(document.createTextNode(items.saved_tabs[i]));
            a.setAttribute("title", items.saved_tabs[i]);
            a.addEventListener('click', onAnchorClick);

            // Inserts created elements into the table in the HTML page
            var row = saved_tabs_table.insertRow(i);
            var cell1 = row.insertCell(0);
            var cell2 = row.insertCell(1);
            cell1.innerHTML = String(i + 1) + ".";
            cell2.appendChild(a);
        }
    });
};

// Callback function for returning URL object
// https://stackoverflow.com/questions/19170595/putting-chrome-tabs-query-in-a-function-always-returns-undefined
function return_callback(callback) {
    chrome.tabs.query({}, function (tabs) {
        callback(tabs);
    });
};

function restore_callback(callback) {
    chrome.storage.sync.get("saved_tabs", function (items) {
        callback(items)
    });
}


// Rough function to save all tab URLs to chrome.storage.sync
// Uses "saved_tabs" as key
function save_tabs(tabs) {
    var saved_tabs = new Array();
    console.log(tabs);

    // Only saving URLs instead of all metadata attributes as to stay under the 8KB limit
    // Keep in mind other limitations such as storage limit
    // Should we be using local storage per machine?
    // https://developer.chrome.com/extensions/storage#type-StorageArea
    for (var i = 0; i < tabs.length; i++) {
        saved_tabs[i] = tabs[i].url;
    }

    // Actual function call to store the array of URLs
    chrome.storage.sync.set({"saved_tabs": saved_tabs}), function () {
        if (chrome.runtime.error) {
            console.log("Runtime error.");
        }
        else {
            console.log("Save Success.");
        }
    };
}

// Basic function to clear saved data in chrome.storage.sync
function clear_storage() {
    chrome.storage.sync.clear();
}

// Rough function to return stored array of URLs in chrome.storage
// Uses "saved_tabs" as key
function fetch_tabs() {
    // Uses saved_tabs as a key to fetch array of stored URLs
    chrome.storage.sync.get("saved_tabs", function (items) {
        if (chrome.runtime.error) {
            console.log("Runtime error.");
        }
        else {
            console.log("Fetch Success.");
            console.log(items);
        }
    });
}

// Function to reopen all saved tabs in a new window
function restore_tabs() {
    chrome.storage.sync.get("saved_tabs", function (items) {
        chrome.windows.create({focused: true, url: items.saved_tabs});
    });
}

// Function to export all saved tabs to a .csv file
function export_tabs(items) {
    var result = items.saved_tabs.toString();
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
    return false;
}

// Initialization routine
document.addEventListener('DOMContentLoaded', init);
