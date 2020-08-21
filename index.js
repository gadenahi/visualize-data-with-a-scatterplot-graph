
const w = 800;
const h = 600;
const padding = 100;
const DATA_FILE_PATH = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json"
const legendVals = ["No doping allegations", "Riders with doping allegations"]
const legendColor = ["blue", "orange"]  

d3.json(DATA_FILE_PATH, function(error, dataoriginal){
  let timeparser = d3.timeParse("%M:%S");
  let timeformat = d3.timeFormat("%M:%S");
  let yearparser = d3.timeParse("%Y");
  let yearformat = d3.timeFormat("%Y");
  
  let dataset = dataoriginal.map(function(d) {
    return {Year:yearparser(d.Year), Time:timeparser(d.Time)}
  })

  const xScale = d3.scaleTime()
                   .domain([d3.min(dataset, (d) => d.Year), d3.max(dataset, (d) => d.Year)])
                   .range([padding, w - padding]);   
  
  const yScale = d3.scaleTime()
                   .domain([d3.max(dataset, (d) => d.Time), d3.min(dataset, (d) => d.Time)])  
                   .range([h - padding, padding]);    
  
  const svg = d3.select("body")
                .append("svg")
                .attr("width", w)
                .attr("height", h)
                .attr("class", "graph")
  
    svg.selectAll("circle")
     .data(dataset)
     .enter()
     .append("circle")
     .attr("data-xvalue", (d, i) => d.Year)
     .attr("data-yvalue", (d, i) => d.Time)
     .attr("cx", (d, i) => xScale(d.Year))  
     .attr("cy", (d, i) => yScale(d.Time)) 
     .attr("r", 5)
     .attr("class", "dot")
     .attr("fill", (d, i) => {if (dataoriginal[i].Doping === "") {return "orange";}else{return "blue";} })
      .on("mouseover", function(d, i) {
      d3.select(".js_toolTip")
        .html(dataoriginal[i].Name + ":" + dataoriginal[i].Nationality + "<br>" + "Year:" + dataoriginal[i].Year + " Time:" + dataoriginal[i].Time + "</br>" + "</br>" + dataoriginal[i].Doping)
        .style("display", "inline-block")
        .style("top", yScale(d.Time) + "px")
        .style("left", xScale(d.Year) + 150 + "px")
        .attr("id", "tooltip")
        .attr("data-year", d.Year)
  })
     .on("mouseout", function(d, i) {
      d3.select(".js_toolTip")
        .style("display", "none")    
  })
  
  svg.append("text")
     .attr("class", "y-label")
     .text("Time in minutes")
     .attr("x", -200)
     .attr("y", 50)
     .attr("transform", "rotate(-90)")
  
  const xAxis = d3.axisBottom(xScale)
                  .tickFormat(yearformat)
  
  const yAxis = d3.axisLeft(yScale)  
                  .tickFormat(timeformat)

  svg.append("g")
     .attr("transform", "translate(0," + (h-padding) + ")")
     .attr("id", "x-axis")
     .call(xAxis)

  svg.append("g")
     .attr("id", "y-axis")
     .attr("transform", "translate(" + (padding) + ", 0)")
     .call(yAxis)
  
  const legend = svg.selectAll(".legends")
                    .data(legendVals)
                    .enter()
                    .append('g')
                    .attr("id", "legend")
                    .attr("transform", function(d, i){
                      return "translate(0," + i * 20 + ")"
                    })
  
  legend.append('rect')
	      .attr("x", w/2 + 40)
	      .attr("y", 90)
	      .attr("width", 10)
	      .attr("height", 10)
	      .style("fill", function (d, i) {return legendColor[i]; })  
  
  legend.append('text')
	      .attr("x", w/2+55)
	      .attr("y", 100)
        .text(function (d, i) {return legendVals[i]; })
	      .style("font-size", 10)
})

