const header = d3.select("#titelWebsite");

const originalText = "iDBPS";
const hoverText = "Interactive Digital Body Position Scanner";

header.on("mouseover", function() {
  d3.select(this)
    .transition()
    .duration(200)
    .style("opacity", 0)
    .on("end", function() {
      d3.select(this)
        .text(hoverText)
        .transition()
        .duration(200)
        .style("opacity", 1);
    });
});

header.on("mouseout", function() {
    d3.select(this)
      .transition()
      .duration(300)
      .style("opacity", 0)
      .on("end", function() {
        d3.select(this)
          .text(originalText)
          .transition()
          .duration(300)
          .style("opacity", 1);
      });
  });
  

