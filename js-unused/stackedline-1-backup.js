// set the dimensions and margins of the graph
const margin = {top: 20, right: 30, bottom: 30, left: 55},
width = 460 - margin.left - margin.right,
height = 400 - margin.top - margin.bottom;
  
// append the svg object to the body of the page
const svg = d3.select("#stackedLine")
.append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform",`translate(${margin.left}, ${margin.top})`);

const heart = d3.select("#heartGroup")
.append("image")
.attr("href", "svg/heart-431.svg")
.attr("width", 30)
  
// Tabel ontleden
d3.csv("data\\ingekorte-dataset.csv").then( function(data) {
  
  // List of groups = header of the csv files
  const keys = data.columns.slice(1)
  console.log(keys)
  
  // X-as toevoegen
    
  //# De vorige code
  //   .domain(d3.extent(data, function(d) { return d.tijd; }))
  //   .range([ 0, width ]);


  const x = d3.scaleLinear()
  .domain([0, d3.max(data, function(d) { return +d.tijd; })])
  .range([ 0, width ]);

  svg.append("g")
  .attr("transform", `translate(0, ${height})`)
  .call(d3.axisBottom(x).ticks(10));
  
  // Y-as toevoegen
  const y = d3.scaleLinear()
  .domain([0, 900])
  .range([ height, 0 ]);
  svg.append("g")
  .call(d3.axisLeft(y));
  
  // color palette
  const color = d3.scaleOrdinal()
  .domain(keys)
  .range(['#b4edd2','#a0cfd3','#8d94ba','#9a7aa0','#87677b'])


  //# Oude kleurenRange
  // .range(['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00','#ffff33','#a65628','#f781bf'])
  
  //stack the data?
  const stackedData = d3.stack()
  .keys(keys)
  (data)
  console.log("This is the stack result: ", stackedData)
  
  const Tooltip = svg
  .append("text")
  .attr("x", 10)
  .attr("y", 0)
  .style("opacity", 0)
  .style("font-size", 17)

  // Three function that change the tooltip when user hover / move / leave a cell
  const mouseover = function(event,d) {
    Tooltip.style("opacity", 1)
    d3.selectAll("[id^=areaField]").style("opacity", .4)
    d3.select(this)
    .style("stroke", "black")
    .style("opacity", 1)
    }
  const mousemove = function(event,d,i) {
    grp = d.key
    Tooltip.text(grp)
  }
    
  const mouseleave = function(event,d) {
    Tooltip.style("opacity", 0)
    d3.selectAll("[id^=areaField]").style("opacity", 1).style("stroke", "none")
  }
     
  const area = d3.area()
  .x(function(d, i) { return x(d.data.tijd); })
  .y0(function(d) { return y(d[0]); })
  .y1(function(d) { return y(d[1]); })

  console.log()
    
  // Gebied (area) genereren
  svg
  .selectAll("mylayers")
  .data(stackedData)
  .join("path")
  .style("fill", function(d) { return color(d.key); })
  .attr("id", function(d) {
    return "areaField-" + d.key;
  })
  .attr("d", area)
  .on("mouseover", mouseover)
  .on("mousemove", mousemove)
  .on("mouseleave", mouseleave)

  heart
  .on("mouseover", function() {
    Tooltip.style("opacity", 1)
    d3.selectAll("[id^=areaField]").style("opacity", .4)
    d3.select("[id^=areaField-Heart]")
    .style("stroke", "black")
    .style("opacity", 1)
    // Wellicht in de toekomst automatisch coderen


    Tooltip.text("Heart Rate (BPM)")
  })
  .on("mousemove", mousemove)
  .on("mouseleave", mouseleave)

})