var bg = chrome.extension.getBackgroundPage();

// Load the Visualization API and the piechart package.
google.load('visualization', '1.0', {
    'packages': ['corechart', 'table']
});

google.chart.setOnLoadCallback(drawChart);


function return_callback(callback){
    chrome.storage.local.get(null, function (items){
        console.log(items);
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
function displayData() {
    // Get the domain data

    var domains = Object.keys(items);
    var chart_data = [];
    for (var domain in domains) {
        var domain_data = Object.values(items);
        var numSeconds = 0;

        numSeconds = domain_data.all;

        if (numSeconds > 0) {
            chart_data.push([domain, {
                v: numSeconds,
                f: timeString(numSeconds),
                p: {
                    style: "text-align: left; white-space: normal;"
                }
            }]);
        }
    }


    // Sort data by descending duration
    chart_data.sort(function(a, b) {
        return b[1].v - a[1].v;
    });

    // Limit chart data
    var limited_data = [];
    var chart_limit;
    // For screenshot: if in iframe, image should always have 9 items

    chart_limit = 9;

    for (var i = 0; i < chart_limit && i < chart_data.length; i++) {
        limited_data.push(chart_data[i]);
    }
    var sum = 0;
    for (var i = chart_limit; i < chart_data.length; i++) {
        sum += chart_data[i][1].v;
    }

    if (sum > 0) {
        limited_data.push(["Other", {
            v: sum,
            f: timeString(sum),
            p: {
                style: "text-align: left; white-space: normal;"
            }
        }]);
    }

    // Draw the chart
    drawChart(limited_data);

    // Add total time


    var total;
    var count = Object.values(items);
    var numSeconds = 0;

    limited_data.push([{
        v: "Total",
        p: {
            style: "font-weight: bold;"
        }
    }, {
        v: numSeconds,
        f: timeString(numSeconds),
        p: {
            style: "text-align: left; white-space: normal; font-weight: bold;"
        }
    }]);

    // Draw the table
    drawTable(limited_data, null);
}

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

function drawTable(table_data, null) {
    var data = new google.visualization.DataTable();


    data.addRows(table_data);

    var options = {
        allowHtml: true,
        sort: 'disable'
    };
    var table = new google.visualization.Table(document.getElementById('table_div'));
    table.draw(data, options);
}



});
