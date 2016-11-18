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

function create_saved_table() {
    var saved_tabs_table = document.getElementById("saved_tabs_table");

    chrome.storage.local.get("saved_tabs", function (items) {
        console.log("saved table");
        console.log(items.saved_tabs);
        for (var i = 0; i < items.saved_tabs.length; i++) {

            // Creates table elements along with tooltips
            var a = document.createElement('a');
            a.href = items.saved_tabs[i];
            a.appendChild(document.createTextNode(items.saved_tabs[i]));
            a.setAttribute("title", items.saved_tabs[i]);
            // a.addEventListener('click', onAnchorClick);

            // var favicon = document.createElement('img');
            // favicon.rel = 'shortcut icon';
            // console.log(items);
            // favicon.src = items.saved_tabs[i].favIconUrl;
            // favicon.type = 'image/x-icon';
            // favicon.width = "20";
            //
            //button to exclude a tab from a save_tabs call
            var btn = document.createElement('BUTTON');
            // btn.addEventListener("click", removeSaveTab);
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
            // cell3.appendChild(favicon);
            cell4.appendChild(btn);
        }
    });
};

function init() {
    console.log("Creating Saved Table From Options");
    create_saved_table();

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
}

console.log("OPTIONS");
document.addEventListener('DOMContentLoaded', init);
// document.getElementById('save').addEventListener('click',
//     save_options);
