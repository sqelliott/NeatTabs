function save_options() {
    var color = document.getElementById('color').value;
    var likesColor = document.getElementById('like').checked;
    chrome.storage.sync.set({
        favoriteColor: color,
        likesColor: likesColor
    }, function () {
        // Update status to let user know options were saved.
        var status = document.getElementById('status');
        status.textContent = 'Options saved.';
        setTimeout(function () {
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
    }, function (items) {
        document.getElementById('color').value = items.favoriteColor;
        document.getElementById('like').checked = items.likesColor;
    });
}
document.addEventListener('DOMContentLoaded', restore_options);


function init() {
    restore_options();
    document.getElementById('history').addEventListener('click', function () {
        chrome.tabs.update({url: 'chrome://chrome/history  '});
    });
    document.getElementById('extensions').addEventListener('click', function () {
        chrome.tabs.update({url: 'chrome://chrome/extensions'});
    });
    document.getElementById('settings').addEventListener('click', function () {
        chrome.tabs.update({url: 'chrome://chrome/settings'});
    });
    document.getElementById('about').addEventListener('click', function () {
        chrome.tabs.update({url: 'chrome://chrome/help'});
    });
    document.getElementById('save').addEventListener('click',
        save_options);
}

document.addEventListener('DOMContentLoaded', init);
