/*
 *
 *  var flow = d3.flow.simple()
 *    .path(pathSelection)
 *    .v(velocity)
 *    .duration(1000)
 *    //symbol dimensions
 *    .w(7)
 *    .h(4)
 *    .spacing(0.5) //spacing ratio
 *
 *  var g = svg.append("g");
 *  flow(g);
 *
 */

if(!d3.flow) d3.flow = {};

d3.flow.simple = function() {
  //user variables
  var v = 1;
  var duration = 1000;
  var w = 7; //width of each flow symbol
  var h = 4;
  var spacing = 0.5; //ratio of symbol width to spacing between each one
  var path;

  //calculated variables
  var n; //number of symbols to show
  var length; //length of the path
  var dw; //spacing between each flow symbol
  //control variables
  var pause = false;
  var timer = false;
  var stop = true;
  //time
  var t = 0; //goes from 0 to 1, keeps track of where we are in loop
  //layout
  var start;
  var end;

  var pathSticker; //we keep a copy of the user specified path as a sticker
  var pipePath;
  var flowPath;

  function chart(g) {
    calculate();
    //generate the start and end points
    var endpoints = g.selectAll("g.endpoint")
      .data([start, end])
    endpoints.enter()
      .append("g").classed("endpoint", true)
      .append("circle").attr({
        r: h*2,
        cx: function(d) { return d.x },
        cy: function(d) { return d.y }
      })

    //create a sticker from the user specified path
    pathSticker = d3.sticker(path);

    //generate the pipe path
    pipePath = pathSticker(g).classed("pipe", true)
      .style({
        "stroke-width": h+2
      })

    //generate the flow path
    flowPath = pathSticker(g).classed("flow", true)
      .style({
        "stroke-width": h,
        "stroke-dashoffset": 0,
        "stroke-dasharray": w + " " + dw,
        "stroke-linecap": "round"
      })
  }

  chart.tick = function(elapsed) {
    if(pause) return false;
    //elapsed is how much time has elapsed in the timer
    t = elapsed / duration;
    //TODO: probably a more efficient way to do this.
    //TODO: investigate using native SVG animation property
    //if(t > 1) t = t - Math.floor(t);
    //move our flow
    flowPath.style({
      "stroke-dashoffset": t * length * v
    });
    return stop; //if stop is true then the timer gets destroyed
  }
  chart.start = function() {
    if(!timer) {
      d3.timer(chart.tick);
    }
    timer = true;
    stop = false;
  }
  chart.resume = function() {
    pause = false;
  }
  chart.pause = function() {
    pause = true;
  }
  chart.stop = function() {
    timer = false;
    stop = true;
  }
  function calculate() {
    // TODO: warn/error message
    //if(!path && !path.getTotalLength) return;
    length = path.getTotalLength();
    n = length * w / spacing;
    dw = length / w * (1 - spacing);

    //positioning/layout
    start  = path.getPointAtLength(0);
    end = path.getPointAtLength(length);
  }

  chart.path = function(_) {
    if(!arguments.length) return path;
    path = d3.select(_).node();
    return chart;
  }
  chart.v = function(_) {
    if(!arguments.length) return v;
    v = _;
    return chart;
  }
  chart.duration = function(_) {
    if(!arguments.length) return duration;
    duration = _;
    console.log("duration", duration)
    return chart;
  }
  chart.w = function(_) {
    if(!arguments.length) return w;
    w = _;
    return chart;
  }
  chart.h = function(_) {
    if(!arguments.length) return h;
    h = _;
    return chart;
  }
  chart.spacing = function(_) {
    if(!arguments.length) return spacing;
    spacing = _;
    return chart;
  }


  return chart;
}












