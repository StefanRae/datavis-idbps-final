// Template gedeeltelijk gebruikt van:
// https://d3-graph-gallery.com/stackedarea.html

const margin = {top: 20, right: 30, bottom: 30, left: 55},
width = 460 - margin.left - margin.right,
height = 400 - margin.top - margin.bottom;
  
// append the svg object to the body of the page
const svg = d3.select("#stackedLine")
.append("svg")
.attr("id", "testGraphRemove")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform",`translate(${margin.left}, ${margin.top})`);


const heart = d3.select("#heartGroup")

const pedal = d3.select("#pedalPressureGroup")

const power = d3.select("#powerGroup")

const speed = d3.select("#speedGroup")

const cadence = d3.select("#cadenceGroup")

function clearChart() {
  d3.select("#stackedLine").selectAll("path").remove();
  d3.select("#stackedLine").selectAll("#timeRange").remove();
  d3.select("#stackedLine").selectAll("#yRange").remove();
}

d3.select('#file-selector').on('change', function() {

  clearChart()
  const filename = d3.select(this).property('value');

  d3.csv('data/' + filename).then(function(data) {

    const keys = data.columns.slice(1)
    console.log(keys)

    const x = d3.scaleLinear()
    .domain([0, d3.max(data, function(d) { return +d.tijd; })])
    .range([ 0, width ]);

    svg.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x).ticks(10))
    .attr("id", "timeRange");

    const tijdXaxis = svg.append("text")
    .attr("x", width + 6)
    .attr("y", height - 6)
    .attr("text-anchor", "middle")
    .text("tijd (s)")
    .attr("font-size", "10px");
    

    const y = d3.scaleLinear()
    .domain([0, 900])
    .range([ height, 0 ]);


    //## Kan weggelaten worden, blijkt uit de feedback irrelevant tot het figuur
    // svg.append("g")
    // .call(d3.axisLeft(y))
    // .attr("id", "yRange");

    // color palette
    const color = d3.scaleOrdinal()
    .domain(keys)
    .range(['#b4edd2','#a0cfd3','#8d94ba','#9a7aa0','#87677b'])

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
    tijdXaxis.raise()

    heart
    .on("mouseover", function() {
      Tooltip.style("opacity", 1)
      d3.selectAll("[id^=areaField]").style("opacity", .4)
      d3.select("[id^=areaField-Heart]")
      .style("stroke", "black")
      .style("opacity", 1)
    Tooltip.text("Heart Rate (BPM)")
    })
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave)

    pedal
    .on("mouseover", function() {
      Tooltip.style("opacity", 1)
      d3.selectAll("[id^=areaField]").style("opacity", .4)
      d3.select("[id^=areaField-Pedal]")
      .style("stroke", "black")
      .style("opacity", 1)
    Tooltip.text("Pedal Pressure (N)")
    })
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave)

    power
    .on("mouseover", function() {
      Tooltip.style("opacity", 1)
      d3.selectAll("[id^=areaField]").style("opacity", .4)
      d3.select("[id^=areaField-Power]")
      .style("stroke", "black")
      .style("opacity", 1)
    Tooltip.text("Power (W)")
    })
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave)

    speed
    .on("mouseover", function() {
      Tooltip.style("opacity", 1)
      d3.selectAll("[id^=areaField]").style("opacity", .4)
      d3.select("[id^=areaField-Speed]")
      .style("stroke", "black")
      .style("opacity", 1)
    Tooltip.text("Speed (km/h)")
    })
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave)

    cadence
    .on("mouseover", function() {
      Tooltip.style("opacity", 1)
      d3.selectAll("[id^=areaField]").style("opacity", .4)
      d3.select("[id^=areaField-Cadence]")
      .style("stroke", "black")
      .style("opacity", 1)
    Tooltip.text("Cadence (RPM)")
    })
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave)
  });
});