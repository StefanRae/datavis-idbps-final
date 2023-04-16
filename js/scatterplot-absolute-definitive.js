// Template gedeeltelijk gebruikt van:
// https://d3-graph-gallery.com/graph/scatter_basic.html

let checkboxesAbsolute = d3.selectAll('input[name="y-axis-absolute"]');

Promise.all(filepaths.map(function(filepath) {
  return d3.csv(filepath);
})).then(function(data) {
  let combinedData = d3.merge(data);
  
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

  const svg = d3.select("#scatterplot-absolute")
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

  const y = d3.scaleLinear()
  .domain([0, 100])
  .range([height, 0]);

  svg.append("g")
  .attr("class", "y-axis-absolute")
  .call(d3.axisLeft(y));

  function updateScatter(combinedData, valueName, valueColour, maxValue) {
    const presentIds = getPresentIds();
    console.log("presentIds: " + presentIds)
  
    y.domain([0, maxValue]);
  
    svg.select(".y-axis-absolute")
      .transition()
      .duration(200)
      .call(d3.axisLeft(y))
  
    presentIds.forEach(function(presentId) {
      const circles = svg.selectAll("circle[id='" + presentId + "']")
        .data(combinedData);
  
      circles
        .attr("cx", function (d) { return x(d.tijd); } )
        .attr("cy", function (d) { return y(+d[presentId]); } )
        .attr("r", "1.5px");
  
      circles.enter()
        .append("circle")
        .attr("cx", function (d) { return x(d.tijd); } )
        .attr("cy", function (d) { return y(+d[presentId]); } )
        .attr("r", "1.5px")
        .style("fill", valueColour)
        .attr("id", presentId);
  
      circles.exit()
        .remove();
    });
  }
  

  function handleCheckboxChange(valueName, valueColour, maxValue) {
    console.log("2")
    if (this.checked) {
      console.log('Checkbox ticked:', valueName)
      updateScatter(combinedData, valueName, valueColour, maxValue);
    } else {
      console.log('Checkbox unticked:', valueName)
      svg.selectAll("circle[id='" + valueName + "']").remove();
  
      const presentIds = getPresentIds();
  
      y.domain([0, d3.max(combinedData, function(d) {
        return d3.max(presentIds, function(id) {
          return +d[id];
        });
      })]);
  
      svg.select(".y-axis-absolute")
        .transition()
        .duration(200)
        .call(d3.axisLeft(y));
  
      presentIds.forEach(function(presentId) {
        const circles = svg.selectAll("circle[id='" + presentId + "']")
          .data(combinedData);
  
        circles
          .attr("cx", function (d) { return x(d.tijd); } )
          .attr("cy", function (d) { return y(+d[presentId]); } )
          .attr("r", "1.5px");
  
        circles.enter()
          .append("circle")
          .attr("cx", function (d) { return x(d.tijd); } )
          .attr("cy", function (d) { return y(+d[presentId]); } )
          .attr("r", "1.5px")
          .style("fill", valueColour)
          .attr("id", presentId);
  
        circles.exit()
          .remove();
      });
    }
  }
  

  function getPresentIds() {
    const presentIds = [];
  
    checkboxesAbsolute.each(function() {
      if (this.checked) {
        presentIds.push(this.value);
      }
    });
  
    return presentIds;
  }


  d3.selectAll('input[name="y-axis-absolute"][value="VO2 (mL/min)"]').on('change', function() {  
    console.log("1")
    const valueName = this.value;
    const valueColour = "#0055a4";
    const maxValue = d3.max(combinedData, function(d) { return +d[valueName]; });
  
    handleCheckboxChange.call(this, valueName, valueColour, maxValue);
  });

  d3.selectAll('input[name="y-axis-absolute"][value="VCO2 (mL/min)"]').on('change', function() {
    const valueName = this.value;
    const valueColour = "#d10a10";
    const maxValue = d3.max(combinedData, function(d) { return +d[valueName]; });

    handleCheckboxChange.call(this, valueName, valueColour, maxValue);
  });

  d3.selectAll('input[name="y-axis-absolute"][value="RER"]').on('change', function() {
    const valueName = this.value;
    const valueColour = "#1c1c1c";
    const maxValue = d3.max(combinedData, function(d) { return +d[valueName]; });

    handleCheckboxChange.call(this, valueName, valueColour, maxValue);
  });

  d3.selectAll('input[name="y-axis-absolute"][value="Energy Expenditure (kJ/min)"]').on('change', function() {
    const valueName = this.value;
    const valueColour = "#4b0082";
    const maxValue = d3.max(combinedData, function(d) { return +d[valueName]; });

    handleCheckboxChange.call(this, valueName, valueColour, maxValue);
  });

  d3.selectAll('input[name="y-axis-absolute"][value="Energy Expenditure (kcal/min)"]').on('change', function() {
    const valueName = this.value;
    const valueColour = "#007f00";
    const maxValue = d3.max(combinedData, function(d) { return +d[valueName]; });

    handleCheckboxChange.call(this, valueName, valueColour, maxValue);
  });

  d3.selectAll('input[name="y-axis-absolute"][value="FiO2 (%)"]').on('change', function() {
    const valueName = this.value;
    const valueColour = "#ffa500";
    const maxValue = d3.max(combinedData, function(d) { return +d[valueName]; });

    handleCheckboxChange.call(this, valueName, valueColour, maxValue);
  });

  d3.selectAll('input[name="y-axis-absolute"][value="FeO2 (%)"]').on('change', function() {
    const valueName = this.value;
    const valueColour = "#800080";
    const maxValue = d3.max(combinedData, function(d) { return +d[valueName]; });
    
    handleCheckboxChange.call(this, valueName, valueColour, maxValue);
  });

  d3.selectAll('input[name="y-axis-absolute"][value="FiCO2 (%)"]').on('change', function() {
    const valueName = this.value;
    const valueColour = "#b8860b";
    const maxValue = d3.max(combinedData, function(d) { return +d[valueName]; });

    handleCheckboxChange.call(this, valueName, valueColour, maxValue);
  });

  d3.selectAll('input[name="y-axis-absolute"][value="FeCO2 (%)"]').on('change', function() {
    const valueName = this.value;
    const valueColour = "#ff69b4";
    const maxValue = d3.max(combinedData, function(d) { return +d[valueName]; });
    
    handleCheckboxChange.call(this, valueName, valueColour, maxValue);
  });

  d3.selectAll('input[name="y-axis-absolute"][value="Flow (sL/min)"]').on('change', function() {
    const valueName = this.value;
    const valueColour = "#006400";
    const maxValue = d3.max(combinedData, function(d) { return +d[valueName]; });

    handleCheckboxChange.call(this, valueName, valueColour, maxValue);
  });

  d3.selectAll('input[name="y-axis-absolute"][value="Pressure Ambient (mbar)"]').on('change', function() {
    const valueName = this.value;
    const valueColour = "#8b0000";
    const maxValue = d3.max(combinedData, function(d) { return +d[valueName]; });
    
    handleCheckboxChange.call(this, valueName, valueColour, maxValue);
  });

  d3.selectAll('input[name="y-axis-absolute"][value="Temperature Flow (Degrees Celsius)"]').on('change', function() {
    const valueName = this.value;
    const valueColour = "#191970";
    const maxValue = d3.max(combinedData, function(d) { return +d[valueName]; });

    handleCheckboxChange.call(this, valueName, valueColour, maxValue);
  });

  d3.selectAll('input[name="y-axis-absolute"][value="Relative Humidity Flow (%)"]').on('change', function() {
    const valueName = this.value;
    const valueColour = "#ff7f50";
    const maxValue = d3.max(combinedData, function(d) { return +d[valueName]; });
    
    handleCheckboxChange.call(this, valueName, valueColour, maxValue);
  });

  d3.selectAll('input[name="y-axis-absolute"][value="Specific VO2 (mL/min/kg)"]').on('change', function() {
    const valueName = this.value;
    const valueColour = "#8fbc8f";
    const maxValue = d3.max(combinedData, function(d) { return +d[valueName]; });
    
    handleCheckboxChange.call(this, valueName, valueColour, maxValue);
  });

  d3.selectAll('input[name="y-axis-absolute"][value="Specific VCO2 (mL/min/kg)"]').on('change', function() {
    const valueName = this.value;
    const valueColour = "#483d8b";
    const maxValue = d3.max(combinedData, function(d) { return +d[valueName]; });

    handleCheckboxChange.call(this, valueName, valueColour, maxValue);
  });

  d3.selectAll('input[name="y-axis-absolute"][value="Respiratory Rate (1/min)"]').on('change', function() {
    const valueName = this.value;
    const valueColour = "#ffa07a";
    const maxValue = d3.max(combinedData, function(d) { return +d[valueName]; });
    
    handleCheckboxChange.call(this, valueName, valueColour, maxValue);
  });

  d3.selectAll('input[name="y-axis-absolute"][value="Ventilation (sL/min)"]').on('change', function() {
    const valueName = this.value;
    const valueColour = "#20b2aa";
    const maxValue = d3.max(combinedData, function(d) { return +d[valueName]; });

    handleCheckboxChange.call(this, valueName, valueColour, maxValue);
  });
});