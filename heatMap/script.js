var colors = ["rgb(49, 54, 149)", "rgb(69, 117, 180)", "rgb(116, 173, 209)", "rgb(171, 217, 233)", "rgb(224, 243, 248)", "rgb(255, 255, 191)", "rgb(254, 224, 144)", "rgb(253, 174, 97)", "rgb(244, 109, 67)", "rgb(215, 48, 39)", "rgb(165, 0, 38)"];

const req = new XMLHttpRequest();
req.open("GET", 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json', true);
req.send();
req.onload = function(){
    const data = JSON.parse(req.responseText);
    console.log(data);
    const baseTemp = data["baseTemperature"];
    data["monthlyVariance"].forEach(item => item.month -= 1)
    const tempData = data["monthlyVariance"];

    const fontSize = 16;
    const width = 5 * Math.ceil(data.monthlyVariance.length / 12);
    const height = 33 * 12;

    const padding = {
      left: 9 * fontSize,
      right: 9 * fontSize,
      top: 1 * fontSize,
      bottom: 8 * fontSize
    }
    var section = d3.select('body').append('section');

    var heading = section.append('heading');
    heading
      .append('h1')
      .attr('id', 'title')
      .text('Monthly Global Land-Surface Temperature');
    heading
      .append('h3')
      .attr('id', 'description')
      .html(
        tempData[0].year +
          ' - ' +
          tempData[tempData.length - 1].year +
          ': base temperature ' +
          baseTemp +
          '&#8451;'
      );
    var svgContainer = section.append("svg").attr("width", width + padding.left).attr("height", height + padding.top + padding.bottom);

    var tooltip = d3
      .tip()
      .attr('class', 'd3-tip')
      .attr('id', 'tooltip')
      .html(function (d) {
        return d;
      })
      .direction('n')
      .offset([-10, 0]);
    
    svgContainer.call(tooltip);
    
    svgContainer
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -240)
      .attr('y', 60)
      .text('Months')
      .attr("class", "axisName");
    
    svgContainer.append("text").attr('x', width/2 + 60).attr('y', height + 55).text("Years").attr("class", "axisName");

    const xScale = d3
      .scaleBand()
      .domain(data.monthlyVariance.map(function (val) {
        return val.year;
      }))
      .range([0, width]);
    const xAxis = d3
      .axisBottom()
      .scale(xScale)
      .tickValues(xScale.domain().filter(year => year%10 === 0))
      .tickFormat(d3.format('y'))
      .tickSize(10, 1);

    svgContainer
      .append('g')
      .call(xAxis)
      .attr('id', 'x-axis')
      .attr('transform', `translate(${padding.left}, ${height})`);
    
    var yScale = d3
      .scaleBand()
      .domain([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11])
      .rangeRound([0, height])
      .padding(0);
  
    var yAxis = d3
      .axisLeft()
      .scale(yScale)
      .tickValues(yScale.domain())
      .tickFormat(function (month) {
        var date = new Date(0);
        date.setUTCMonth(month);
        var format = d3.utcFormat('%B');
        return format(date);
      })
      .tickSize(10, 1);

    svgContainer
      .append('g')
      .call(yAxis)
      .attr('id', 'y-axis')
      .attr('transform', `translate(${padding.left}, 0)`);
    
    const legendWidth = 400;
    const legendHeight = 20;

    var legendContainer = svgContainer
      .append('g')
      .attr('id', 'legend')
      .attr(
        'transform',
        'translate(' +
          padding.left +
          ',' +
          (padding.top + height + padding.bottom - 2 * 50) +
          ')'
      );
    const rangeColor = [1.7, 2.8, 3.9, 5.0, 6.1, 7.2, 8.3, 9.5, 10.6, 11.7, 12.8, 13.9]
    const legendScale = d3
      .scaleBand()
      .domain(rangeColor)
      .range([0, 400]);
    const legendAxis = d3
      .axisBottom()
      .scale(legendScale)
      .tickValues(legendScale.domain().filter(item => item !== 1.7 && item !== 13.9))
      .tickFormat(d3.format(".1f"))
      .tickSize(10, 1);
    legendContainer
      .selectAll('rect')
      .data(rangeColor)
      .enter()
      .append('rect')
      .attr('x', (d, i) => legendScale(rangeColor[i]) + 17)
      .attr('y', padding.top)
      .attr('width', (d, i) => legendScale(rangeColor[i + 1]) - legendScale(rangeColor[i]))
      .attr('height', legendHeight)
      .attr('fill', (d, i) => colors[i])
      .style('display', (d, i) => {
        if (i == 0 || i == 10) {
          return 'none';
        }
      });
    legendContainer
      .append('g')
      .call(legendAxis)
      .attr('transform', `translate(0, ${legendHeight + padding.top})`);
    svgContainer
      .append('g')
      .classed("map", true)
      .selectAll('rect')
      .data(tempData)
      .enter()
      .append('rect')
      .attr('class', 'cell')
      .attr('data-month', function (d) {
        return d.month;
      })
      .attr('data-year', function (d) {
        return d.year;
      })
      .attr('data-temp', function (d) {
        return baseTemp + d.variance;
      })
      .attr('x', d => padding.left + xScale(d.year))
      .attr('y', d => yScale(d.month))
      .attr('width', d => xScale.bandwidth(d.year))
      .attr('height', d => yScale.bandwidth(d.month))
      .attr('fill', function (d) {
        var temperature = baseTemp + d.variance
        if (temperature < 2.8) {
          return colors[0];
        } else if (temperature < 3.9) {
          return colors[1];
        } else if (temperature < 5.0) {
          return colors[2];
        } else if (temperature < 6.1) {
          return colors[3];
        } else if (temperature < 7.2) {
          return colors[4];
        } else if (temperature < 8.3) {
          return colors[5];
        } else if (temperature < 9.5) {
          return colors[6];
        } else if (temperature < 10.6) {
          return colors[7];
        } else if (temperature < 11.7) {
          return colors[8];
        } else if (temperature < 12.8) {
          return colors[9];
        } else {
          return colors[10];
        }
      })
      .style("border", "none")
      .on('mouseover', function (event, d) {
        var date = new Date(d.year, d.month);
        var str =
          "<span class='date'>" +
          d3.utcFormat('%Y - %B')(date) +
          '</span>' +
          '<br />' +
          "<span class='temperature'>" +
          d3.format('.1f')(data.baseTemperature + d.variance) +
          '&#8451;' +
          '</span>' +
          '<br />' +
          "<span class='variance'>" +
          d3.format('+.1f')(d.variance) +
          '&#8451;' +
          '</span>';
        tooltip.attr('data-year', d.year);
        tooltip.show(str, this);
      })
      .on('mouseout', tooltip.hide);

}