function getData(t){var e="22421a7c9d3xxxxx2b71394",a="http://api.openweathermap.org/data/2.5/forecast/daily?id="+cities[t]+"&units=metric&cnt=7&appid="+e,r=[],n=[],l={};d3.json(a,function(t){t.list.forEach(function(t){r.push(round(t.temp.day))}),t.list.forEach(function(t){n.push(day(t.dt))}),l.humidity=t.list[0].humidity+"%",l.clouds=t.list[0].clouds+"%",l.pressure=t.list[0].pressure+" hPa",l.snow=t.list[0].snow||"brak opadów",l.rain=t.list[0].rain||"brak opadów",l.speed=t.list[0].speed+" m/s",l.day=round(t.list[0].temp.day)+"°C",l.max=round(t.list[0].temp.max)+"°C",l.min=round(t.list[0].temp.min)+"°C",l.night=round(t.list[0].temp.night)+"°C",drawChart(r,n),drawChart2(r,n),setWeather(l)})}function drawChart(t,e){var a={top:20,bottom:20,left:20,right:20},r=320-a.top-a.bottom,n=320-a.left-a.right,l=d3.select(".weather_chart").append("svg").attr("width",n+a.left+a.right).attr("height",0).style("background","#f4f4f4").append("g").attr("transform","translate("+a.left+","+a.top+")");d3.select(".weather_chart").select("svg").transition().attr("height",r+a.bottom+a.top);var i=Math.max(Math.abs(d3.min(t)),Math.abs(d3.max(t)));if(t.some(isNegative))var s=[-i,i];else var s=[0,d3.max(t)];var d=d3.scale.linear().domain(s).range([r,0]).nice(),o=d3.scale.ordinal().domain(d3.range(t.length)).rangeBands([0,n],.2),c=d3.svg.axis().scale(d).orient("left");l.selectAll("rect").data(t).enter().append("rect").attr("class",function(t){return t>0?"hot":"cold"}).attr("width",o.rangeBand()).attr("height",function(t){return Math.abs(d(t)-d(0))}).attr("x",function(t,e){return o(e)}).attr("y",function(t){return d(Math.max(0,t))}),l.append("g").attr("class","x axis").call(c),l.append("g").attr("class","y axis").append("line").attr("y1",d(0)).attr("y2",d(0)).attr("x1",0).attr("x2",n)}function drawChart2(t,e){var a={top:30,bottom:20,left:40,right:40},r=620-a.left-a.right,n=360-a.top-a.bottom,l=Math.max(Math.abs(d3.max(t)),Math.abs(d3.min(t)));if(t.some(isNegative))var i=[-l,l],s=[l,-l];else var i=[0,d3.max(t)],s=[d3.max(t),0];var d=d3.scale.linear().domain(i).range([0,n]).nice(),o=d3.scale.linear().domain(s).range([0,n]).nice(),c=d3.scale.linear().domain([0,t.length]).range([0,r]),u=d3.select(".weather_chart1").append("svg").attr("preserveAspectRatio","xMinYMin meet").attr("viewBox","0 0 800 0").style("background","#333").append("g").attr("transform","translate("+a.left+","+a.top+")");d3.select(".weather_chart1").select("svg").transition().attr("viewBox","0 0 800 360");var f=d3.svg.line().x(function(t,e){return c(e+1)}).y(function(t,e){return n-d(t)});u.append("path").attr("d",f(t)).attr("stroke","steelblue").attr("stroke-width",2).attr("fill","none"),u.selectAll("circle").data(t).enter().append("circle").attr("r",4).attr("fill","steelblue").attr("cx",function(t,e){return c(e+1)}).attr("cy",function(t){return n-d(t)}),u.selectAll("text").data(t).enter().append("text").text(function(t){return t+"°C"}).attr("font-family","Arial").attr("font-size","12px").attr("fill","#fff").attr("x",function(t,e){return c(e+1)-20}).attr("y",function(t){return n});var m=d3.svg.axis().orient("bottom").scale(c).tickFormat(function(t,a){return e[a-1]}),h=d3.svg.axis().orient("left").scale(o);u.append("g").attr("transform","translate(0,"+d(0)+")").attr("class","line").call(m).selectAll("text").attr("transform",d3.transform("translate(-30, 30) rotate(-45)")).attr("font-family","Arial").attr("font-size","13px").attr("fill","#fff").attr("stroke","none"),u.append("g").attr("class","line").call(h).selectAll("text").attr("font-family","Arial").attr("font-size","13px").attr("fill","#fff").attr("stroke","none")}function setWeather(t){d3.selectAll(".day").data(t.day).html(t.day),d3.selectAll(".max").data(t.max).html(t.max),d3.selectAll(".min").data(t.min).html(t.min),d3.selectAll(".night").data(t.night).html(t.night),d3.selectAll(".humidity").data(t.humidity).html(t.humidity),d3.selectAll(".clouds").data(t.clouds).html(t.clouds),d3.selectAll(".rain").data(t.rain+"").html(t.rain),d3.selectAll(".snow").data(t.snow+"").html(t.snow),d3.selectAll(".speed").data(t.speed).html(t.speed),d3.selectAll(".pressure").data(t.pressure).html(t.pressure)}function round(t){return Math.round(10*t)/10}function day(t){var e=new Date(1e3*t),a=e.getDay();switch(a){case 0:return"Niedziela";case 1:return"Poniedziałek";case 2:return"Wtorek";case 3:return"Środa";case 4:return"Czwartek";case 5:return"Piątek";case 6:return"Sobota"}}function isNegative(t){return t<0}var reset=document.getElementById("reset");reset.addEventListener("click",function(t){t.preventDefault();var e=document.getElementById("select"),a=e.selectedIndex,r=e.options[e.selectedIndex].text;d3.selectAll("svg").remove(),getData(a),document.getElementById("cityName").innerHTML=r}),window.onload=function(){getData(0)};var cities=["3088171","3117735","3128760"];