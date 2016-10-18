/**
 * Created by Arthur on 10/16/16.
 */

chrome.tabs.query({}, function (tabs) {
        var openTabs_table = document.getElementById("openTabs_table");

        for (var i = 0; i < tabs.length; i++) {
            var a = document.createElement('a');
            a.href = tabs[i].url;
            a.appendChild(document.createTextNode(tabs[i].title));
            a.addEventListener('click', onAnchorClick);

            var row = openTabs_table.insertRow(i);
            var cell1 = row.insertCell(0);
            var cell2 = row.insertCell(1);
            cell1.innerHTML = String(i + 1) + ".";
            cell2.appendChild(a);
        }
    }
);

function onAnchorClick(event) {
    chrome.tabs.create({ url: event.srcElement.href });
    return false;
}
