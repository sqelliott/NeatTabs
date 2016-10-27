/**
 * Created by Arthur on 10/16/16.
 */

// Initialization function
function init() {
    console.log("Starting Logging");
    document.getElementById("save").addEventListener("click", function () {
        console.log("Saving Session.");
        return_callback(save_tabs);
    });
    document.getElementById("restore").addEventListener("click", function () {
        console.log("Restoring Session.");
        restore_tabs();
    });
    document.getElementById("clear").addEventListener("click", function () {
        console.log("Clearing Session.");
        clear_storage();
    });
    document.getElementById("options").addEventListener("click", function () {
        console.log("Options Menu.");
        chrome.tabs.create({ url: "src/options_custom/index.html" });
    });
    document.getElementById("neatTabs").addEventListener("click", function () {
        console.log("Options Menu.");
        chrome.tabs.create({ url: "src/options_custom/index.html" });
    });
    document.getElementById("export").addEventListener("click", function () {
        console.log("Options Menu.");
        restore_callback(export_tabs);
    });
}

// Fetches all open tabs across all browser windows
// Lists URLs as their titles with links to the HTML table
// TODO Move into the init function
// TODO Add a sort function
chrome.tabs.query({}, function (tabs) {
        var openTabs_table = document.getElementById("openTabs_table");

        // save_tabs(tabs);

        for (var i = 0; i < tabs.length; i++) {
            // Creates table elements along with tooltips
            var a = document.createElement('a');
            a.href = tabs[i].url;
            a.appendChild(document.createTextNode(tabs[i].title));
            a.setAttribute("title", tabs[i].url);
            a.addEventListener('click', onAnchorClick);
            var btn = document.createElement("BUTTON");
            var btnText = document.createTextNode("Remove");
            btn.appendChild(btnText);
            b.addEventListener('click', removeTab);


            // Inserts created elements into the table in the HTML page
            var row = openTabs_table.insertRow(i);
            var cell1 = row.insertCell(0);
            var cell2 = row.insertCell(1);
            var cell3 = row.insertCell(2);
            cell1.innerHTML = String(i + 1) + ".";
            cell2.appendChild(a);
            cell3.appendChild(btn);
        }

        // Testing the fetch tabs functionality
        // fetch_tabs();
    }
);

// Callback function for returning URL object
// https://stackoverflow.com/questions/19170595/putting-chrome-tabs-query-in-a-function-always-returns-undefined
function return_callback(callback){
    chrome.tabs.query({},function(tabs){
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
    // var tabs_return = new Object();
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

// Remove a tab from current que
function removeTab(event){
    var openTabs_table = document.getElementById("openTabs_table");
    //openTabs_table.deleteRow(0);
    return false;

}

// Initialization routine
document.addEventListener('DOMContentLoaded', init);
