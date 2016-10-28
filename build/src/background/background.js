var settings = new Store("settings", {
    "sample_setting": "This is how you use Store.js to remember values"
});

function getCurrentDateTime() {
    var now = new Date();
    return now.toLocaleString();
}
