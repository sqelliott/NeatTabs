// Load the Visualization API and the piechart package.
google.load('visualization', '1.0', {
    'packages': ['corechart']
});

google.setOnLoadCallback(function () {
    return_callback(displayData);
});

function return_callback(callback) {
    chrome.storage.local.get(null, function (items) {
        callback(items);
    });
}

// Converts duration to String
function timeString(numSeconds) {
    if (numSeconds === 0) {
        return "0 seconds";
    }
    var remainder = numSeconds;
    var timeStr = "";
    var timeTerms = {
        hour: 3600,
        minute: 60,
        second: 1
    };
    // Don't show seconds if time is more than one hour
    if (remainder >= timeTerms.hour) {
        remainder = remainder - (remainder % timeTerms.minute);
        delete timeTerms.second;
    }
    // Construct the time string
    for (var term in timeTerms) {
        var divisor = timeTerms[term];
        if (remainder >= divisor) {
            var numUnits = Math.floor(remainder / divisor);
            timeStr += numUnits + " " + term;
            // Make it plural
            if (numUnits > 1) {
                timeStr += "s";
            }
            remainder = remainder % divisor;
            if (remainder) {
                timeStr += " and ";
            }
        }
    }
    return timeStr;
}

// Show the data for the time period indicated by addon
function displayData(items) {
    // Get the domain data
    var limited_data = [];
    var chart_data = [];
    var domains = Object.keys(items);
    var times = Object.values(items);
    var chart_limit;
    chart_limit = 6;
    for (var i = 0; i < domains.length && i < chart_limit; i++) {
        var numSeconds = times[i];

        if (numSeconds > 0) {
            limited_data.push([domains[i], {
                v: numSeconds,
                f: timeString(numSeconds),
                p: {
                    style: "text-align: left; white-space: normal;"
                }
            }]);
        }
    }


    // Sort data by descending duration
    limited_data.sort(function (a, b) {
        return b[1].v - a[1].v;
    });

    drawChart(limited_data);
}

// Callback that creates and populates a data table,
// instantiates the pie chart, passes in the data and
// draws it.
function drawChart(chart_data) {
    // Create the data table.
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Domain');
    data.addColumn('number', 'Time');
    data.addRows(chart_data);

    // Set chart options
    var options = {
        tooltip: {
            text: 'percentage'
        },
        chartArea: {
            width: 400,
            height: 180
        }
    };

    // Instantiate and draw our chart, passing in some options.
    var chart = new google.visualization.PieChart(document.getElementById('chart_div'));
    chart.draw(data, options);
}
