const FILE = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json';

var body = d3.select('body');

var svg = d3.select('#tree-map'),
  width = +svg.attr('width'),
  height = +svg.attr('height');

var fader = function (color) {
  return d3.interpolateRgb(color, '#fff')(0.2);
};

var color = d3.scaleOrdinal().range(
  [
    '#1f77b4',
    '#aec7e8',
    '#ff7f0e',
    '#ffbb78',
    '#2ca02c',
    '#98df8a',
    '#d62728',
    '#ff9896',
    '#9467bd',
    '#c5b0d5',
    '#8c564b',
    '#c49c94',
    '#e377c2',
    '#f7b6d2',
    '#7f7f7f',
    '#c7c7c7',
    '#bcbd22',
    '#dbdb8d',
    '#17becf',
    '#9edae5'
  ].map(fader)
);

var treemap = d3.treemap().size([width, height]).paddingInner(1);

var tooltip = d3
      .tip()
      .attr('class', 'tooltip')
      .attr('id', 'tooltip')
      .html(d => d)
      .direction('n')
      .offset([-10, 0]);
svg.call(tooltip);

const req = new XMLHttpRequest();
req.open("GET", FILE, true);
req.send();
req.onload = function(){
    const data = JSON.parse(req.responseText);

    let root = d3
                .hierarchy(data)
                .eachBefore(d => {
                  d.data.id = (d.parent ? d.parent.data.id + '.' : '') + d.data.name;
                })
                .sum(d => d.value)
                .sort((a,b) => b.height - a.height || b.value - a.value);
        
    treemap(root);
    
    let categories = root.leaves().map(node => node.data.category);
    categories = categories.filter(function (category, index, self) {
      return self.indexOf(category) === index;
    });

    var group = svg
                  .selectAll('g')
                  .data(root.leaves())
                  .enter()
                  .append('g')
                  .attr('class', 'group')
                  .attr('transform', d => `translate(${d.x0}, ${d.y0})`);
    
    group
      .append('rect')
      .attr('id', d => d.data.id)
      .attr('class', 'tile')
      .attr('width', d => d.x1 - d.x0)
      .attr('height', d => d.y1 - d.y0)
      .attr('fill', d => color(d.data.category))
      .attr('data-name', d => d.data.name)
      .attr('data-category', d => d.data.category)
      .attr('data-value', d => d.data.value)
      .on('mousemove', (event, d) => {
        let str = (
            'Name: ' +
              d.data.name +
              '<br>Category: ' +
              d.data.category +
              '<br>Value: ' +
              d.data.value
          );
        tooltip
          .attr('data-value', d.data.value);
        tooltip.show(str, event.currentTarget);
      })
      .on('mouseout', tooltip.hide);
    group
      .append('text')
      .attr('class', 'tile-text')
      .selectAll('tspan')
      .data(d => d.data.name.split(/(?=[A-Z][^A-Z])/g))
      .enter()
      .append('tspan')
      .attr('x', 4)
      .attr('y', (d,i) => 13 + i * 10)
      .text(d => d)
      .style('font-size', '0.64rem')
    let legend = d3.select('#legend'),
        legendWidth = +legend.attr('width');
    const LEGEND_OFFSET = 10;
    const LEGEND_RECT_SIZE = 15;
    const LEGEND_H_SPACING = 150;
    const LEGEND_V_SPACING = 10;
    const LEGEND_TEXT_X_OFFSET = 3;
    const LEGEND_TEXT_Y_OFFSET = -2;
    var legendElemsPerRow = Math.floor(legendWidth / LEGEND_H_SPACING);

    var legendElem = legend
      .append('g')
      .attr('transform', 'translate(60,' + LEGEND_OFFSET + ')')
      .selectAll('g')
      .data(categories)
      .enter()
      .append('g')
      .attr('transform', function (d, i) {
        return (
          'translate(' +
          (i % legendElemsPerRow) * LEGEND_H_SPACING +
          ',' +
          (Math.floor(i / legendElemsPerRow) * LEGEND_RECT_SIZE +
            LEGEND_V_SPACING * Math.floor(i / legendElemsPerRow)) +
          ')'
        );
      });

    legendElem
      .append('rect')
      .attr('width', LEGEND_RECT_SIZE)
      .attr('height', LEGEND_RECT_SIZE)
      .attr('class', 'legend-item')
      .attr('fill', function (d) {
        return color(d);
      });

    legendElem
      .append('text')
      .attr('x', LEGEND_RECT_SIZE + LEGEND_TEXT_X_OFFSET)
      .attr('y', LEGEND_RECT_SIZE + LEGEND_TEXT_Y_OFFSET)
      .text(function (d) {
        return d;
      });
}