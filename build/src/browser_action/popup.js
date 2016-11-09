// Initialization function

console = chrome.extension.getBackgroundPage().console;
//control tabs to be saved by user
current_tabs_bitVector = new Array();

function init() {
    console.log("Starting Logging");

    return_callback(create_current_table);
    create_saved_table();

    document.getElementById("current_tabs").addEventListener("click", function () {
        console.log("Showing Current Tabs.");
        var saved_table = document.getElementById("saved_tabs_table");
        var current_tabs_table = document.getElementById("current_tabs_table");

        saved_table.style.display = "none";
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
    document.getElementById("track_menu").addEventListener("click", function () {
        console.log("Tracking Session.");
        return_callback(track_tabs);
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
        btn.addEventListener("click",excludeCurrentTab);
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

    chrome.storage.local.get("saved_tabs", function (items) {
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
    chrome.tabs.query({}, function (tabs) {
        callback(tabs);
    });
};

function restore_callback(callback) {
    chrome.storage.local.get("saved_tabs", function (items) {
        callback(items)
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
    for (var i = 0, j =0; i < tabs.length; i++) {
            if( current_tabs_bitVector[i]){
                    saved_tabs[j++] = tabs[i].url;
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
}

// Clears local storage
function clear_storage() {
    chrome.storage.local.clear();
}

// Function to reopen all saved tabs in a new window
function restore_tabs() {
    chrome.storage.local.get("saved_tabs", function (items) {
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

    if(current_tabs_bitVector[rowInd]==1){
        current_tabs_bitVector[rowInd] = 0;
        var btnText = document.createTextNode("Include");
        btn.appendChild(btnText);
        console.log("exclude " +(rowInd+1)+" from current_tabs_table");
    }
    else{
        current_tabs_bitVector[rowInd] = 1;
        var btnText = document.createTextNode("Exclude");
        btn.appendChild(btnText);
        console.log("Include " +(rowInd+1)+" from current_tabs_table");
    }


}


//Object to save the url and time
function track_url(url, time) {
    this._url = url;
    this._time = time;

}
//get the current time
function set_current_time() {
    var now =  new Date();
    return now;

}
//check if track_tabs is empty.
function get_track_tabs(){
chrome.storage.local.get("track_tabs", function (items) {
    if(items.track_tabs.length > 0){

        return false;
    }
   else {
       return true;
    }
});
}

//Populate the track_tabs array
function track_tabs(tabs) {
    console.log("before the loop");

    //check if the track_tabs array has been populated already.
    //if the track_tabs is empty continue.  
    if (get_track_tabs()) {

    console.log("Inside the loop");

    var track_tabs = new Array();
    for (var i = 0; i < tabs.length; i++) {

        track_tabs[i] = new track_url(tabs[i].url, set_current_time());
    }



    console.log(track_tabs);
 // save the track_url object into track_tabs
    chrome.storage.local.set({"track_tabs": track_tabs}), function () {
        if (chrome.runtime.error) {
            console.log("Runtime error.");
        }
        else {
            console.log("Save Success.");
        }
      };
    }



    console.log("outside the loop");
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
