// Initialization function

//control tabs to be saved by user
current_tabs_bitVector = new Array();
var targetWindow = null;
var tabCount = 0;

function init() {
    console.log("Starting Logging");

    chrome.windows.getCurrent(getWindows);

    return_callback(create_current_table);
    create_saved_table();

    document.getElementById("current_tabs").addEventListener("click", function() {
        console.log("Showing Current Tabs.");
        var saved_table = document.getElementById("saved_tabs_table");
        var current_tabs_table = document.getElementById("current_tabs_table");

        saved_table.style.display = "none";
        current_tabs_table.style.display = "";
    });

    document.getElementById("saved_tabs").addEventListener("click", function() {
        console.log("Showing Saved Tabs.");
        var saved_tabs_table = document.getElementById("saved_tabs_table");
        var current_tabs_table = document.getElementById("current_tabs_table");

        saved_tabs_table.style.display = "";
        current_tabs_table.style.display = "none";
    });

    document.getElementById("save_menu").addEventListener("click", function() {
        console.log("Saving Session.");
        return_callback(save_tabs);
    });
    document.getElementById("track_menu").addEventListener("click", function() {
        console.log("Tracking Session.");
        return_callback(track_tabs);
    });
    document.getElementById("restore_menu").addEventListener("click", function() {
        console.log("Restoring Session.");
        restore_tabs();
    });
    document.getElementById("clear_menu").addEventListener("click", function() {
        console.log("Clearing Session.");
        clear_storage();
    });
    document.getElementById("options_menu").addEventListener("click", function() {
        console.log("Opening Options.");
        chrome.tabs.create({ url: "src/options_page/options.html" });
    });
    document.getElementById("export_menu").addEventListener("click", function() {
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

        // Creates table elements along with tooltips
        var a = document.createElement('a');
        a.href = tabs[i].url;
        a.appendChild(document.createTextNode(tabs[i].title));
        a.setAttribute("title", tabs[i].url);
        a.addEventListener('click', onAnchorClick);

        //button to remove a tab from a save_tabs call
        var btn = document.createElement('BUTTON');
        btn.addEventListener("click", excludeCurrentTab);
        var btnText = document.createTextNode('Exclude');
        btn.appendChild(btnText);

        // Inserts created elements into the table in the HTML page
        var row = current_tabs_table.insertRow(i);
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        cell1.innerHTML = String(i + 1) + ".";
        cell2.appendChild(a);
        cell3.appendChild(btn);
    }
};

function create_saved_table() {
    var saved_tabs_table = document.getElementById("saved_tabs_table");

    chrome.storage.local.get("saved_tabs", function(items) {
        console.log(items.saved_tabs);
        for (var i = 0; i < items.saved_tabs.length; i++) {

            // Creates table elements along with tooltips
            var a = document.createElement('a');
            a.href = items.saved_tabs[i];
            a.appendChild(document.createTextNode(items.saved_tabs[i]));
            a.setAttribute("title", items.saved_tabs[i]);
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
            var cell3 = row.insertCell(2);
            cell1.innerHTML = String(i + 1) + ".";
            cell2.appendChild(a);
            /*cell3.appendChild(btn);*/
        }
    });
};

// Callback function for returning URL object
// https://stackoverflow.com/questions/19170595/putting-chrome-tabs-query-in-a-function-always-returns-undefined
function return_callback(callback) {
    chrome.tabs.query({}, function(tabs) {
        callback(tabs);
    });
};

function restore_callback(callback) {
    chrome.storage.local.get("saved_tabs", function(items) {
        callback(items);
    });
}

// Saves only tab urls
function save_tabs(tabs) {
    var saved_tabs = new Array();
    console.log(tabs);

    // Only saving URLs instead of all metadata attributes as to stay under the 8KB limit
    // Keep in mind other limitations such as storage limit
    // Should we be using local storage per machine?
    // https://developer.chrome.com/extensions/storage#type-StorageArea
    for (var i = 0, j = 0; i < tabs.length; i++) {
        if (current_tabs_bitVector[i]) {
            saved_tabs[j++] = tabs[i].url;
        }
    }


    chrome.storage.local.set({ "saved_tabs": saved_tabs }),
        function() {
            if (chrome.runtime.error) {
                console.log("Runtime error.");
            } else {
                console.log("Save Success.");
            }
        };
}

// Clears local storage
function clear_storage() {
    chrome.storage.local.clear();
}

// Function to reopen all saved tabs in a new window
function restore_tabs() {
    chrome.storage.local.get("saved_tabs", function(items) {
        chrome.windows.create({ focused: true, url: items.saved_tabs });
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
    chrome.tabs.create({ url: event.srcElement.href });
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
        console.log("exclude " + (rowInd + 1) + " from current_tabs_table");
    } else {
        current_tabs_bitVector[rowInd] = 1;
        var btnText = document.createTextNode("Exclude");
        btn.appendChild(btnText);
        console.log("Include " + (rowInd + 1) + " from current_tabs_table");
    }


}


//Object to save the url and time
function track_url(url, time) {
    this._url = url;
    this._time = time;

}
//get the current time
function set_current_time() {
    var now = new Date();
    return now;

}
//check if track_tabs is empty.
/*function get_track_tabs(){
 chrome.storage.local.get("track_tabs", function (items) {
 if(items.track_tabs.length > 0){

 return false;
 }
 else {
 return true;
 }
 });
 }
 */

//Enter current url to the the track_tabs array
function track_tabs(current_url) {
    console.log("inside track_tabs: " + current_url.length);

    if (current_url.length > 0) {

        var current_url_time = new track_url(current_url[1], set_current_time());
        console.log("added to local storage : " + current_url_time._url + current_url_time._time);
        // save the current url object into track_tabs
        chrome.storage.local.set({ "track_tabs": current_url_time }),
            function() {
                if (chrome.runtime.error) {
                    console.log("Runtime error.");
                } else {
                    console.log("Save to tracker Success.");
                }
            };
    }

    console.log("outside the loop");
    return false;
}

setTimeout(return_active_focus(), 2000);

function return_active_focus() {
    var current_url;
    console.log("inside return_active_focus");
    var Regexp = /^(\w+:\/\/[^\/]+).*$/;
    //check whether the tabs are active in their windows
    // and whether the tabs are in the current window.
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, function(current_tabs) {
        //it should only have one tab.
        if (current_tabs.length == 1) {
            current_url = current_tabs[0].url.match(Regexp);

            //Check if the window is focus.
            chrome.windows.get(current_tabs[0].windowId, function(window) {
                if (!window.focused) {
                    current_url = null;
                    console.log("Current active/focused: NULL ");
                }
                // current_url;
                track_tabs(current_url);
                console.log("Current active/focused: " + current_url[0]);
            });
        }
    });


    return false;
}

/*function removeSaveTab(event){
 var saved_tabs_table = document.getElementById("saved_tabs_table");
 var row = event.srcElement.parentNode.parentNode;
 var rowInd = row.rowIndex;

 chrome.storage.sync.get("saved_tabs", function (items) {
 var saved_tabs = items.saved_tabs;
 console.log(saved_tabs);
 var new_saved_tabs =saved_tabs.slice(rowInd,rowInd+1);
 console.log(new_saved_tabs);

 });

 chrome.storage.sync.set({"saved_tabs": new_saved_tabs}), function () {
 if (chrome.runtime.error) {
 console.log("Runtime error.");
 }
 else {
 console.log("Save Success.");
 }
 };

 }*/


// Initialization routine
document.addEventListener('DOMContentLoaded', init);

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
    chrome.windows.getAll({ "populate": true }, listTabs);
}

function listTabs(windows) {
    var numWindows = windows.length;
    var tabPosition = tabCount;

    for (var i = 0; i < numWindows; i++) {
        var win = windows[i];
        console.log(win);
        var current_tabs_table = document.getElementById("test_table");
        var numTabs = win.tabs.length;

        for (var j = 0; j < numTabs; j++) {
            var tab = win.tabs[j];

            var table = document.createElement("TABLE");
            table.border = "1";
            var columnCount = numTabs;

            var row = table.insertRow(-1);
            for (var i = 0; i < columnCount; i++) {
                var headerCell = document.createElement("TH");
                headerCell.innerHTML = "header";
                row.appendChild(headerCell);
            }

            for (var i = 1; i < numTabs; i++) {
                row = table.insertRow(-1);
                for (var j = 0; j < columnCount; j++) {
                    var cell = row.insertCell(-1);
                    cell.innerHTML = tab.url;
                }
            }

            var a = document.createElement('a');
            a.href = tab.url;
            a.appendChild(document.createTextNode(tab.title));
            a.setAttribute("title", tab.url);
            a.addEventListener('click', onAnchorClick);

            // Inserts created elements into the table in the HTML page
            var row = current_tabs_table.insertRow(i);
            var cell1 = row.insertCell(0);
            var cell2 = row.insertCell(1);
            cell1.innerHTML = String(i + 1) + ".";
            cell2.appendChild(a);
            console.log(tab.url);
            tabPosition++;
        }
        console.log("NEW WINDOW HERE");
        current_tabs_table.appendChild(table);
    }
}

chrome.browserAction.onClicked.addListener(init);
