var width = 800,
  height = 400,
  margin = 20;

var tooltip = d3.select(".visHolder").append("div").attr("id", "tooltip").style("opacity", "0");
var color = d3.scaleOrdinal()
  .domain([true, false])
  .range(['#d62728', '#1f77b4']);
var svgContainer = d3.select(".visHolder").append("svg").attr("width", width + 100).attr("height", height + 60);

const req = new XMLHttpRequest();
req.open("GET",'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json',true);
req.send();
req.onload = function(){
    const data = JSON.parse(req.responseText);
    const timeRange = data.map(item => new Date(item["Seconds"] * 1000));
    const yearRange = data.map(item => item["Year"]);
    svgContainer
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -240)
      .attr('y', 12)
      .text('Time In Minutes');

    svgContainer.append("text").attr('x', 200).attr('y', height + 55).text("Years").attr("class", "axisName");
    var xScale = d3
      .scaleTime()
      .domain([d3.min(yearRange) - 1, d3.max(yearRange) + 1])
      .range([0, width]);

    var xAxis = d3.axisBottom().scale(xScale).tickFormat(d3.format('d'));

    svgContainer
      .append('g')
      .call(xAxis)
      .attr('id', 'x-axis')
      .attr('transform', `translate(60, ${height + margin})`);

    var yScale = d3.scaleTime().domain([d3.max(timeRange), d3.min(timeRange)]).range([height, 0]);

    var yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat('%M:%S'));

    svgContainer
      .append('g')
      .call(yAxis)
      .attr('id', 'y-axis')
      .attr('transform', `translate(60, ${margin})`);

    var legendContainer = svgContainer.append('g').attr('id', 'legend');

    var legend = legendContainer
      .selectAll('#legend')
      .data(color.domain())
      .enter()
      .append('g')
      .attr('class', 'legend-label')
      .attr('transform', function (d, i) {
        return 'translate(60,' + (height / 2 - i * 20) + ')';
      });

    legend
      .append('rect')
      .attr('x', width - 18)
      .attr('width', 18)
      .attr('height', 18)
      .style('fill', color);

    legend
      .append('text')
      .attr('x', width - 24)
      .attr('y', 9)
      .attr('dy', '.35em')
      .style('text-anchor', 'end')
      .style('font-size', '10px')
      .text(function (d) {
        if (d) {
          return 'Riders with doping allegations';
        } else {
          return 'No doping allegations';
        }
      });
    d3.select('svg')
      .selectAll('.dot')
      .data(data)
      .enter()
      .append('circle')
      .attr('class', 'dot')
      .attr('r', 6)
      .attr('cx', d => xScale(d["Year"]) + 60)
      .attr('cy', d => yScale(new Date(d["Seconds"] * 1000)) + margin)
      .attr('data-xvalue', d => d["Year"])
      .attr('data-yvalue', d => new Date(d["Seconds"] * 1000)) 
      .attr('index', (d, i) => i)
      .style('fill', function (d) {
        return color(d.Doping !== '');
      })
      .on('mouseover', function (event, d) {
        var i = this.getAttribute('index');
        tooltip.transition().duration(200).style('opacity', 0.9);
        tooltip.attr("data-year", d["Year"]);
        tooltip
          .html(
            d["Name"] + ": " + d["Nationality"] + "<br/>" + "Year: " + d["Year"] + ", Time: " + d["Time"] + (d["Doping"] ? "<br/>" + "<br/>" + d["Doping"] : "")
          )
          .style("left", event.pageX - 310 + "px")
          .style("top", event.pageY - 160 + "px")
      })
      .on('mouseout', function () {
        tooltip.transition().duration(200).style('opacity', 0);
      });
      
}