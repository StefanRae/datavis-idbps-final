// Template gedeeltelijk gebruikt van:
// https://d3-graph-gallery.com/graph/scatter_basic.html

let checkboxesRelative = d3.selectAll('input[name="y-axis-relative"]');

Promise.all(filepaths.map(function(filepath) {
  return d3.csv(filepath);
})).then(function(data) {
  let combinedData = d3.merge(data);
  
  // Parse the 'tijd' column to integers
  combinedData.forEach(function(d) {
    d.tijd = parseInt(d.tijd);
  });
  
  console.log(combinedData)

  const maxTijd = d3.max(combinedData, function(d) {
    return d.tijd;
  });


  console.log("Maximum tijd value: " + maxTijd);
  
  const margin = {top: 10, right: 30, bottom: 30, left: 60},
        width = 460 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

  const svg = d3.select("#scatterplot-relative")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

  const x = d3.scaleLinear()
  .domain([0, maxTijd])
  .range([0, width]);

  svg.append("g")
  .attr("transform", `translate(0, ${height})`)
  .call(d3.axisBottom(x).ticks(10));

  svg.append("text")
  .attr("x", width + 6)
  .attr("y", height - 6)
  .attr("text-anchor", "middle")
  .text("tijd (s)")
  .attr("font-size", "10px");

  const y = d3.scaleLinear()
  .domain([0, 1])
  .range([height, 0]);

  svg.append("g")
  .call(d3.axisLeft(y).tickValues([0, 1]).tickFormat(d => d === 0 ? "min" : "max"));

  function updateScatter(combinedData, valueName, valueColour, maxValue, minValue) {
    const circles = svg.selectAll("circle[id='" + valueName + "']")
      .data(combinedData);

    y.domain([minValue, maxValue]);
  
    circles
      .attr("cx", function (d) { return x(d.tijd); } )
      .attr("cy", function (d) { return y(+d[valueName]); } )
      .attr("r", "1.5px");
  
      circles.enter()
      .append("circle")
      .attr("cx", function (d) { return x(d.tijd); } )
      .attr("cy", function (d) { return y(+d[valueName]); } )
      .attr("r", "1.5px")
      .style("fill", valueColour)
      .attr("id", valueName)
      .on("mouseover", function(d) {
        tooltip.style("opacity", 1);
        tooltip.text(valueName + " min: " + minValue + " max: " + maxValue)
          .attr("x", "10px")
          .attr("y", "20px");
        
        svg.selectAll("circle:not([id='" + valueName + "'])")
        .style("opacity", 0.2);

      })
      .on("mouseout", function(d) {
        tooltip.transition()
          .duration(100)
          .style("opacity", 0);
          svg.selectAll("circle:not([id='" + valueName + "'])")
        .style("opacity", 1);
      });
    
  
    circles.exit()
      .remove();
  }

  function hoverCheckboxTooltip(checkbox, valueName, minValue, maxValue, svg, tooltip) {
    d3.select(checkbox)
      .on("mouseover", function(d) {
        tooltip.style("opacity", 1);
        tooltip.text(valueName + " min: " + minValue + " max: " + maxValue)
          .attr("x", "10px")
          .attr("y", "20px");
        svg.selectAll("circle:not([id='" + valueName + "'])")
          .style("opacity", 0.2);
      })
      .on("mouseout", function(d) {
        tooltip.transition()
          .duration(100)
          .style("opacity", 0);
        svg.selectAll("circle:not([id='" + valueName + "'])")
          .style("opacity", 1);
      });
  
    handleCheckboxChange.call(checkbox, valueName, valueColour, maxValue, minValue);
  }

  function handleCheckboxChange(valueName, valueColour, maxValue, minValue) {
    if (this.checked) {
      console.log('Checkbox ticked:', valueName)
      updateScatter(combinedData, valueName, valueColour, maxValue, minValue);
    } else {
      console.log('Checkbox unticked:', valueName)
      svg.selectAll("circle[id='" + valueName + "']").remove();
    }
  }

  d3.selectAll('input[name="y-axis-relative"][value="VO2 (mL/min)"]').on('change', function() {
    const valueName = this.value;
    const valueColour = "#0055a4";
    const maxValue = d3.max(combinedData, function(d) { return +d[valueName]; });
    const minValue = d3.min(combinedData, function(d) { return +d[valueName]; });
    
    handleCheckboxChange.call(this, valueName, valueColour, maxValue, minValue)
    hoverCheckboxTooltip(this, valueName, minValue, maxValue, svg, tooltip);
  });

  d3.selectAll('input[name="y-axis-relative"][value="VCO2 (mL/min)"]').on('change', function() {
    const valueName = this.value;
    const valueColour = "#d10a10";
    const maxValue = d3.max(combinedData, function(d) { return +d[valueName]; });
    const minValue = d3.min(combinedData, function(d) { return +d[valueName]; });

    handleCheckboxChange.call(this, valueName, valueColour, maxValue, minValue)
    hoverCheckboxTooltip(this, valueName, minValue, maxValue, svg, tooltip);
  });

  d3.selectAll('input[name="y-axis-relative"][value="RER"]').on('change', function() {
    const valueName = this.value;
    const valueColour = "#1c1c1c";
    const maxValue = d3.max(combinedData, function(d) { return +d[valueName]; });
    const minValue = d3.min(combinedData, function(d) { return +d[valueName]; });

    handleCheckboxChange.call(this, valueName, valueColour, maxValue, minValue)
    hoverCheckboxTooltip(this, valueName, minValue, maxValue, svg, tooltip);
  });

  d3.selectAll('input[name="y-axis-relative"][value="Energy Expenditure (kJ/min)"]').on('change', function() {
    const valueName = this.value;
    const valueColour = "#4b0082";
    const maxValue = d3.max(combinedData, function(d) { return +d[valueName]; });
    const minValue = d3.min(combinedData, function(d) { return +d[valueName]; });

    handleCheckboxChange.call(this, valueName, valueColour, maxValue, minValue)
    hoverCheckboxTooltip(this, valueName, minValue, maxValue, svg, tooltip);
  });

  d3.selectAll('input[name="y-axis-relative"][value="Energy Expenditure (kcal/min)"]').on('change', function() {
    const valueName = this.value;
    const valueColour = "#007f00";
    const maxValue = d3.max(combinedData, function(d) { return +d[valueName]; });
    const minValue = d3.min(combinedData, function(d) { return +d[valueName]; });

    handleCheckboxChange.call(this, valueName, valueColour, maxValue, minValue)
    hoverCheckboxTooltip(this, valueName, minValue, maxValue, svg, tooltip);
  });

  d3.selectAll('input[name="y-axis-relative"][value="FiO2 (%)"]').on('change', function() {
    const valueName = this.value;
    const valueColour = "#ffa500";
    const maxValue = d3.max(combinedData, function(d) { return +d[valueName]; });
    const minValue = d3.min(combinedData, function(d) { return +d[valueName]; });

    handleCheckboxChange.call(this, valueName, valueColour, maxValue, minValue)
    hoverCheckboxTooltip(this, valueName, minValue, maxValue, svg, tooltip);
  });

  d3.selectAll('input[name="y-axis-relative"][value="FeO2 (%)"]').on('change', function() {
    const valueName = this.value;
    const valueColour = "#800080";
    const maxValue = d3.max(combinedData, function(d) { return +d[valueName]; });
    const minValue = d3.min(combinedData, function(d) { return +d[valueName]; });

    handleCheckboxChange.call(this, valueName, valueColour, maxValue, minValue)
    hoverCheckboxTooltip(this, valueName, minValue, maxValue, svg, tooltip);
  });

  d3.selectAll('input[name="y-axis-relative"][value="FiCO2 (%)"]').on('change', function() {
    const valueName = this.value;
    const valueColour = "#b8860b";
    const maxValue = d3.max(combinedData, function(d) { return +d[valueName]; });
    const minValue = d3.min(combinedData, function(d) { return +d[valueName]; });

    handleCheckboxChange.call(this, valueName, valueColour, maxValue, minValue)
    hoverCheckboxTooltip(this, valueName, minValue, maxValue, svg, tooltip);
  });

  d3.selectAll('input[name="y-axis-relative"][value="FeCO2 (%)"]').on('change', function() {
    const valueName = this.value;
    const valueColour = "#ff69b4";
    const maxValue = d3.max(combinedData, function(d) { return +d[valueName]; });
    const minValue = d3.min(combinedData, function(d) { return +d[valueName]; });

    handleCheckboxChange.call(this, valueName, valueColour, maxValue, minValue)
    hoverCheckboxTooltip(this, valueName, minValue, maxValue, svg, tooltip);
  });

  d3.selectAll('input[name="y-axis-relative"][value="Flow (sL/min)"]').on('change', function() {
    const valueName = this.value;
    const valueColour = "#006400";
    const maxValue = d3.max(combinedData, function(d) { return +d[valueName]; });
    const minValue = d3.min(combinedData, function(d) { return +d[valueName]; });
    
    handleCheckboxChange.call(this, valueName, valueColour, maxValue, minValue)
    hoverCheckboxTooltip(this, valueName, minValue, maxValue, svg, tooltip);
  });

  d3.selectAll('input[name="y-axis-relative"][value="Pressure Ambient (mbar)"]').on('change', function() {
    const valueName = this.value;
    const valueColour = "#8b0000";
    const maxValue = d3.max(combinedData, function(d) { return +d[valueName]; });
    const minValue = d3.min(combinedData, function(d) { return +d[valueName]; });

    handleCheckboxChange.call(this, valueName, valueColour, maxValue, minValue)
    hoverCheckboxTooltip(this, valueName, minValue, maxValue, svg, tooltip);
  });

  d3.selectAll('input[name="y-axis-relative"][value="Temperature Flow (Degrees Celsius)"]').on('change', function() {
    const valueName = this.value;
    const valueColour = "#191970";
    const maxValue = d3.max(combinedData, function(d) { return +d[valueName]; });
    const minValue = d3.min(combinedData, function(d) { return +d[valueName]; });

    handleCheckboxChange.call(this, valueName, valueColour, maxValue, minValue)
    hoverCheckboxTooltip(this, valueName, minValue, maxValue, svg, tooltip);
  });

  d3.selectAll('input[name="y-axis-relative"][value="Relative Humidity Flow (%)"]').on('change', function() {
    const valueName = this.value;
    const valueColour = "#ff7f50";
    const maxValue = d3.max(combinedData, function(d) { return +d[valueName]; });
    const minValue = d3.min(combinedData, function(d) { return +d[valueName]; });

    handleCheckboxChange.call(this, valueName, valueColour, maxValue, minValue)
    hoverCheckboxTooltip(this, valueName, minValue, maxValue, svg, tooltip);
  });

  d3.selectAll('input[name="y-axis-relative"][value="Specific VO2 (mL/min/kg)"]').on('change', function() {
    const valueName = this.value;
    const valueColour = "#8fbc8f";
    const maxValue = d3.max(combinedData, function(d) { return +d[valueName]; });
    const minValue = d3.min(combinedData, function(d) { return +d[valueName]; });

    handleCheckboxChange.call(this, valueName, valueColour, maxValue, minValue)
    hoverCheckboxTooltip(this, valueName, minValue, maxValue, svg, tooltip);
  });

  d3.selectAll('input[name="y-axis-relative"][value="Specific VCO2 (mL/min/kg)"]').on('change', function() {
    const valueName = this.value;
    const valueColour = "#483d8b";
    const maxValue = d3.max(combinedData, function(d) { return +d[valueName]; });
    const minValue = d3.min(combinedData, function(d) { return +d[valueName]; });

    handleCheckboxChange.call(this, valueName, valueColour, maxValue, minValue)
    hoverCheckboxTooltip(this, valueName, minValue, maxValue, svg, tooltip);
  });

  d3.selectAll('input[name="y-axis-relative"][value="Respiratory Rate (1/min)"]').on('change', function() {
    const valueName = this.value;
    const valueColour = "#ffa07a";
    const maxValue = d3.max(combinedData, function(d) { return +d[valueName]; });
    const minValue = d3.min(combinedData, function(d) { return +d[valueName]; });

    handleCheckboxChange.call(this, valueName, valueColour, maxValue, minValue)
    hoverCheckboxTooltip(this, valueName, minValue, maxValue, svg, tooltip);
  });

  d3.selectAll('input[name="y-axis-relative"][value="Ventilation (sL/min)"]').on('change', function() {
    const valueName = this.value;
    const valueColour = "#20b2aa";
    const maxValue = d3.max(combinedData, function(d) { return +d[valueName]; });
    const minValue = d3.min(combinedData, function(d) { return +d[valueName]; });

    handleCheckboxChange.call(this, valueName, valueColour, maxValue, minValue)
    hoverCheckboxTooltip(this, valueName, minValue, maxValue, svg, tooltip);
  });

  const tooltip = d3.select("#scatterplot-tooltip")
  .append("text")
  .attr("class", "tooltip")
  .style("opacity", 0)
  .attr("fill", "black");


  const selectAllBtn = d3.select("#select-all-button")
  .on("click", function() {
    if (this.innerText === "Selecteer Alles") {
      this.innerText = "Deselecteer Alles";
      checkboxesRelative.property("checked", true).dispatch("change");
    } else {
      this.innerText = "Selecteer Alles";
      checkboxesRelative.property("checked", false).dispatch("change");
    }
  });



});