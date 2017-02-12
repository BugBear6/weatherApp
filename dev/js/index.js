var reset = document.getElementById('reset');
reset.addEventListener('click', function(e){

  e.preventDefault();
  var selected = document.getElementById('select');
  var selectedId = selected.selectedIndex;
  var selectedName = selected.options[selected["selectedIndex"]].text

  d3.selectAll('svg').remove();
  getData( selectedId );
  document.getElementById('cityName').innerHTML = selectedName;

});

window.onload = function(){
  getData( 0 ); //pass city id
}

var cities = [
  "3088171", // poznan
  "3117735", // madrid
  "3128760" // barcelona
];

function getData(id){
  var key = "22421a7cxxxxf2b71394";
  var url = "http://api.openweathermap.org/data/2.5/forecast/daily?id=" + cities[id] + "&units=metric&cnt=7&appid=" + key;
  var data = [];
  var days = [];
  var weather = { };

  d3.json(url, function(response){

    response.list.forEach(function(el){
      data.push( round(el.temp.day) );
    });

    response.list.forEach(function(el){
      days.push( day(el.dt) );
    });

    weather.humidity = response.list[0].humidity + "%";
    weather.clouds = response.list[0].clouds + "%";
    weather.pressure = response.list[0].pressure + " hPa";
    weather.snow = response.list[0].snow || "brak opadów";
    weather.rain = response.list[0].rain || "brak opadów";
    weather.speed = response.list[0].speed + " m/s";

    weather.day = round(response.list[0].temp.day) + "°C";
    weather.max = round(response.list[0].temp.max) + "°C";
    weather.min = round(response.list[0].temp.min) + "°C";
    weather.night = round(response.list[0].temp.night) + "°C";

    drawChart(data, days);
    drawChart2(data, days);

    setWeather(weather); 

  });
  
}

function drawChart(data, days){

  var margin = {top: 20, bottom: 20, left: 20, right: 20},
      height = 320 - margin.top - margin.bottom,
      width = 320 - margin.left - margin.right;

  var canvas = d3.select('.weather_chart')
    .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', 0)
      .style('background', '#f4f4f4')
      .append("g")
      .attr("transform", "translate("+ margin.left + "," + margin.top + ")");

  d3.select('.weather_chart').select('svg').transition()
    .attr('height', height + margin.bottom + margin.top);


  /* scales */

  var y0 = Math.max(Math.abs(d3.min(data)), Math.abs(d3.max(data)));
  
  if( data.some(isNegative) )
    var domain = [-y0, y0];
  else
    var domain = [0, d3.max(data)];

  var scaleY = d3.scale.linear()
      .domain(domain)
      .range([height, 0])
      .nice();

  var scaleX = d3.scale.ordinal()
      .domain(d3.range(data.length))
      .rangeBands([0, width], .2);

  var axisY = d3.svg.axis()
    .scale(scaleY)
    .orient('left');

    canvas.selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', function(d){
        if (d>0) return "hot"; else return "cold";
      })
      .attr('width', scaleX.rangeBand())
      .attr('height', function(d){
        return Math.abs( scaleY(d) - scaleY(0) );
      })
      .attr('x', function(d,i){
        return scaleX(i);
      })
      .attr('y', function(d){
        return scaleY(Math.max(0,d));
      });

        
    // add labels
    // canvas.selectAll('text')
    //   .data(data)
    //   .enter()
    //   .append('text')
    //   .text(function(d, i){
    //     return d + "°C";
    //   })
    //   .attr("font-family", "Arial")
    //   .attr("font-size", "14px")
    //   .attr("fill", "#000")
    //   .attr("x", function(d, i) {
    //     return scaleX(i)+5;
    //   })
    //   .attr("y", function(d) {
    //     return  scaleY(d) - 5;
    //   });

    canvas.append("g")
      .attr('class', 'x axis')
      .call(axisY);

    canvas.append("g")
        .attr("class", "y axis")
      .append("line")
        .attr("y1", scaleY(0))
        .attr("y2", scaleY(0))
        .attr("x1", 0)
        .attr("x2", width);

}


function drawChart2(data, days){

  var margin1 = {
    top: 30,
    bottom: 20,
    left: 40,
    right: 40
  };

  var width1 = 620 - margin1.left - margin1.right;
  var height1 = 360 - margin1.top - margin1.bottom;

  var yRange = Math.max( Math.abs(d3.max(data)) , Math.abs(d3.min(data)) );

  if( data.some(isNegative) ){
    var domain1 = [-yRange, yRange];
    var domainAxis1 = [yRange, -yRange]
  }

  else{
    var domain1 = [0, d3.max(data)];
    var domainAxis1 = [d3.max(data), 0];
  }

  var scaleY1 = d3.scale.linear()
    .domain( domain1 )
    .range([0, height1])
    .nice();

  var axisScaleY1 = d3.scale.linear()
    .domain( domainAxis1 )
    .range([0, height1])
    .nice();

  var scaleX1 = d3.scale.linear()
    .domain([0, data.length])
    .range([0, width1]);

  var canvas1 = d3.select('.weather_chart1')
    .append('svg')
    // .attr('width', width1 + margin1.left + margin1.right)
    // .attr('height', 0)
    .attr('preserveAspectRatio', "xMinYMin meet")
    .attr('viewBox', "0 0 800 0")
    .style('background', '#333')
    .append('g')
    .attr('transform', 'translate(' + margin1.left + ',' + margin1.top + ')');

    d3.select('.weather_chart1').select('svg').transition()
          .attr('viewBox', "0 0 800 360");


  /* draw a line */
  var lineFunction  = d3.svg.line()
    .x(function(d, i) {
        return scaleX1(i+1);
    })
  .y(function(d, i) {
    return height1 - scaleY1(d);
  });

  canvas1.append("path")
    .attr("d", lineFunction(data))
    .attr("stroke", "steelblue")
    .attr("stroke-width", 2)
    .attr("fill", "none");

/* draw circles */
  canvas1.selectAll('circle')
    .data(data)
    .enter()
    .append('circle')
    .attr('r', 4)
    .attr('fill', 'steelblue')
    .attr('cx', function(d, i) {
      return scaleX1(i+1);
    })
    .attr('cy', function(d) {
      return height1 - scaleY1(d);
    });

  canvas1.selectAll("text")
    .data(data)
    .enter()
    .append("text")
    .text(function(d) {
      return d + "°C";
    })
    .attr("font-family", "Arial")
    .attr("font-size", "12px")
    .attr("fill", "#fff")
    .attr("x", function(d, i) {
      return scaleX1(i+1) -20;
    })
    .attr("y", function(d) {
      // return height1 - scaleY1(d);
      return height1;
    });

  /* generate axis */
  var xAxis1 = d3.svg.axis()
      .orient('bottom')
      .scale(scaleX1)
      .tickFormat(function(d,i){
        return days[i-1];
      });

  var yAxis1 = d3.svg.axis()
      .orient('left')
      .scale(axisScaleY1);

  canvas1
    .append("g")
      .attr("transform", "translate(0," + scaleY1(0) + ")")
      .attr('class', 'line')
      .call(xAxis1)
      .selectAll('text')
        .attr('transform', d3.transform('translate(-30, 30) rotate(-45)'))
        .attr("font-family", "Arial")
        .attr("font-size", "13px")
        .attr('fill', '#fff')
        .attr('stroke', 'none');

  canvas1
    .append("g")
      .attr('class', 'line')
      .call(yAxis1)
        .selectAll('text')
          .attr("font-family", "Arial")
          .attr("font-size", "13px")
          .attr('fill', '#fff')
          .attr('stroke', 'none');
      
}

function setWeather(weather){

  d3.selectAll('.day')
    .data(weather.day)
    .html(weather.day);

  d3.selectAll('.max')
    .data(weather.max)
    .html(weather.max);

  d3.selectAll('.min')
    .data(weather.min)
    .html(weather.min);

  d3.selectAll('.night')
    .data(weather.night)
    .html(weather.night);
    
  d3.selectAll('.humidity')
    .data(weather.humidity)
    .html(weather.humidity);
    
  d3.selectAll('.clouds')
    .data(weather.clouds)
    .html(weather.clouds);
    
  d3.selectAll('.rain')
    .data(weather.rain+'')
    .html(weather.rain);

  d3.selectAll('.snow')
    .data(weather.snow+'')
    .html(weather.snow);
    
  d3.selectAll('.speed')
    .data(weather.speed)
    .html(weather.speed);
    
  d3.selectAll('.pressure')
    .data(weather.pressure)
    .html(weather.pressure);
}

// helper functions

function round(n){
  return Math.round( n * 10) / 10;
}

function day(stamp){
	var date = new Date(stamp *1000),
		  dayOfTheWeek = date.getDay();

	switch(dayOfTheWeek) {
    case 0: return "Niedziela";
    case 1: return "Poniedziałek";
    case 2: return "Wtorek";
    case 3: return "Środa";
    case 4: return "Czwartek";
    case 5: return "Piątek";
    case 6: return "Sobota";		
  }
}

function isNegative (element){
	return (element<0);
}
