import React from 'react'
import * as d3 from "d3";


function drawChart(svgRef: React.RefObject<SVGSVGElement>) {

  const data = Object.assign([
    [.096899, .008859, .000554, .004430, .025471, .024363, .005537, .025471],
    [.001107, .018272, .000000, .004983, .011074, .010520, .002215, .004983],
    [.000554, .002769, .002215, .002215, .003876, .008306, .000554, .003322],
    [.000554, .001107, .000554, .012182, .011628, .006645, .004983, .010520],
    [.002215, .004430, .000000, .002769, .104097, .012182, .004983, .028239],
    [.011628, .026024, .000000, .013843, .087486, .168328, .017165, .055925],
    [.000554, .004983, .000000, .003322, .004430, .008859, .017719, .004430],
    [.002215, .007198, .000000, .003322, .016611, .014950, .001107, .054264]
  ], {
    names: ["Apple", "HTC", "Huawei", "LG", "Nokia", "Samsung", "Sony", "Other"],
    colors: ["#c4c4c4", "#69b40f", "#ec1d25", "#c8125c", "#008fc8", "#10218b", "#134b24", "#737373"]
  })

  const names = data.names === undefined ? d3.range(data.length) : data.names

  const colors = data.colors === undefined ? d3.quantize(d3.interpolateRainbow, names.length) : data.colors


  const tickStep = d3.tickStep(0, d3.sum(data.flat()), 100)

  const formatValue = d3.format(".1~%")

  const width = 928

  const height = width 

  const outerRadius = Math.min(width, height) * 0.5 - 60

  const innerRadius = outerRadius - 10

  const chord = d3.chord()
  .padAngle(10 / innerRadius)
  .sortSubgroups(d3.descending)
  .sortChords(d3.descending)

  const arc = d3.arc()
  .innerRadius(innerRadius)
  .outerRadius(outerRadius)

  const ribbon = d3.ribbon()
  .radius(innerRadius - 1)
  .padAngle(1 / innerRadius)

  const color = d3.scaleOrdinal(names, colors)

  function ticks({startAngle, endAngle, value}) {
    const k = (endAngle - startAngle) / value;
    return d3.range(0, value, tickStep).map(value => {
      return {value, angle: value * k + startAngle};
    });
  }

  const svg = d3.select(svgRef.current)
      .attr("viewBox", [-width / 2, -height / 2, width, height]);

  const chords = chord(data);

  const group = svg.append("g")
      .attr("font-size", 10)
      .attr("font-family", "sans-serif")
    .selectAll("g")
    .data(chords.groups)
    .join("g");

  group.append("path")
      .attr("fill", d => color(names[d.index]))
      .attr("d", arc);

  group.append("title")
      .text(d => `${names[d.index]}
${formatValue(d.value)}`);

  const groupTick = group.append("g")
    .selectAll("g")
    .data(ticks)
    .join("g")
      .attr("transform", d => `rotate(${d.angle * 180 / Math.PI - 90}) translate(${outerRadius},0)`);

  groupTick.append("line")
      .attr("stroke", "currentColor")
      .attr("x2", 6);

  groupTick.append("text")
      .attr("x", 8)
      .attr("dy", "0.35em")
      .attr("transform", d => d.angle > Math.PI ? "rotate(180) translate(-16)" : null)
      .attr("text-anchor", d => d.angle > Math.PI ? "end" : null)
      .text(d => formatValue(d.value));

  group.select("text")
      .attr("font-weight", "bold")
      .text(function(d) {
        return this.getAttribute("text-anchor") === "end"
            ? `↑ ${names[d.index]}`
            : `${names[d.index]} ↓`;
      });

  svg.append("g")
      .attr("fill-opacity", 0.8)
    .selectAll("path")
    .data(chords)
    .join("path")
      .style("mix-blend-mode", "multiply")
      .attr("fill", d => color(names[d.source.index]))
      .attr("d", ribbon)
    .append("title")
      .text(d => `${formatValue(d.source.value)} ${names[d.target.index]} → ${names[d.source.index]}${d.source.index === d.target.index ? "" : `\n${formatValue(d.target.value)} ${names[d.source.index]} → ${names[d.target.index]}`}`);

  return svg.node();
}

const ChordChart: React.FunctionComponent = () => {
  const svg = React.useRef<SVGSVGElement>(null);

  React.useEffect(() => {
    drawChart(svg);
  }, [svg]);

  return (
    <div id="chart">
      <svg ref={svg} />
    </div>
  );
};

export default ChordChart
