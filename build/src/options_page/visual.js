var data = [];

/*data.push({"domain": "Hello" , "time": 1});
 data.push({"domain": "World" , "time": 2});
 data.push({"domain": "Bye" , "time": 3});
 /*data.push({"domain": "Ms." , "time": 2.4});
 data.push({"domain": "Rica" , "time": 1.3});*/



chrome.storage.local.get(null, function(items) {
    for (key in items) {
        data.push({"domain": key._domain , "time": key_storeTime});
    }
});


var width = 960,
    height = 500,
    radius = Math.min(width, height) / 2;

var color = d3.scale.ordinal()
    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

////finished with constants

//creates the SVG variable
var visual = d3.select("piechart").append("svg")
    .data([data])
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

//defines the arc for the pie chart
var arc = d3.svg.arc()
    .outerRadius(radius - 10)
    .innerRadius(0);

//defines the position of the label for an arc
/*var labelArc = d3.svg.arc()
 .outerRadius(radius - 40)
 .innerRadius(radius - 40);*/

//creates a pie
var pie = d3.layout.pie()
    .sort(null)
    .value(function(d) { return d.time; });


var arcs = visual.selectAll("g.slice")
    .data(pie)
    .enter()
    .append("g")
    .attr("class", "slice");

arcs.append("path")
    .attr("d", arc)
    .style("fill", function(d,i) { return color(i); });//change color

arcs.append("text")
    .attr("transform", function(d) { d.innerRadius = 0;
        d.outerRadius = radius-10;
        return "translate(" + arc.centroid(d) + ")"; })
    .attr("text-anchor", "middle")
    .text(function(d,i) { return data[i].domain; });

/**
 * Created by Richa on 11/23/2016.
 */
