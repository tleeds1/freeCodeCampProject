const EDUCATION_FILE = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json';
const COUNTY_FILE = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json';

var body = d3.select('body');

var svg = d3.select('svg');

var tooltip = d3
      .tip()
      .attr('class', 'tooltip')
      .attr('id', 'tooltip')
      .html(d => d)
      .direction('n')
      .offset([-10, 0]);
svg.call(tooltip);
var path = d3.geoPath();

const req = new XMLHttpRequest();
req.open("GET", EDUCATION_FILE, true);
req.send();
req.onload = function(){
    const edu = JSON.parse(req.responseText);
    const eduRate = edu.map(data => data.bachelorsOrHigher);
    const req1 = new XMLHttpRequest();
    req1.open("GET", COUNTY_FILE, true);
    req1.send();
    req1.onload = function(){
      var color = d3
        .scaleThreshold()
        .domain(d3.range(d3.min(eduRate), d3.max(eduRate), (d3.max(eduRate) - d3.min(eduRate)) / 8))
        .range(d3.schemeBlues[9]);
      const county = JSON.parse(req1.responseText);
      
      var xScale = d3.scaleLinear().domain([d3.min(eduRate), d3.max(eduRate)]).rangeRound([600, 860]);

      var g = svg
        .append('g')
        .attr('class', 'key')
        .attr('id', 'legend')
        .attr('transform', 'translate(0,40)');
      g
        .selectAll('rect')
        .data(color.range().map(d => color.invertExtent(d)))
        .enter()
        .append('rect')
        .attr('height', 8)
        .attr('x', d => xScale(d[0]))
        .attr('width', function (d) {
          return d[0] && d[1] ? xScale(d[1]) - xScale(d[0]) : xScale(null);
        })
        .attr('fill', function (d) {
          return color(d[0]);
        });
      g
        .append('text')
        .attr('class', 'caption')
        .attr('x', xScale.range()[0])
        .attr('y', -6)
        .attr('fill', '#000')
        .attr('text-anchor', 'start')
        .attr('font-weight', 'bold');
      
      g
        .call(
        d3
          .axisBottom(xScale)
          .tickSize(13)
          .tickFormat(function (x) {
            return Math.round(x) + '%';
          })
          .tickValues(color.domain())
        )
        .select('.domain')
        .remove();
      
      svg
        .append('g')
        .attr('class', 'counties')
        .selectAll('path')
        .data(topojson.feature(county, county.objects.counties, ).features)
        .enter()
        .append('path')
        .attr('class', 'county')
        .attr('data-fips', d => d.id)
        .attr('data-education', d => {
          let res = edu.filter(obj => obj.fips === d.id);
          if (res.length > 0) return res[0].bachelorsOrHigher;
          return 0;
        })
        .attr('fill', d => color(edu.find(obj => obj.fips === d.id)?.bachelorsOrHigher||0))
        .attr('d', path)
        .on('mouseover', (event, d) => {
          let res = edu.filter(obj => obj.fips === d.id);
          let str;
          if (res.length > 0) {
            str =  (
              res[0]['area_name'] +
              ', ' +
              res[0]['state'] +
              ': ' +
              res[0].bachelorsOrHigher +
              '%'
            );
          }
          tooltip
            .attr('data-education', () => {
              return edu.filter(obj => obj.fips === d.id).length ? edu.filter(obj => obj.fips === d.id)[0].bachelorsOrHigher : 0;
            });
          tooltip.show(str, event.currentTarget);
        })
        .on('mouseout', tooltip.hide);
      svg
        .append('path')
        .datum(
          topojson.mesh(county, county.objects.states, function (a, b) {
            return a !== b;
          })
        )
        .attr('class', 'states')
        .attr('d', path);
    }
    
}