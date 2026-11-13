function getWeather(){
	var city = document.getElementById("city").value.trim(); //trim() to remove any uncessary space
	var resultBox = document.getElementById("resultBox");
	var resultEl = document.getElementById("result");
	
	if(!city){
		resultEl.textContent = "Please enter a city name";
		return;
	}
	
	var key = "a146e5a7fdf952fe9255e70ea6fe1d3e"
	//web address the request will be sent to
	var url = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + key;
	
	resultEl.textContent = "Fetching weather data....";
	fetch(url)
		.then(function(res){return res.json();})// convert the reponse from the website from JSON to a JS object to be usable
		
		.then(function(data){
			if(data.cod !== 200){
				resultEl.textContent = data.message;
				return;
			}
			resultEl.innerHTML = buildDisplay(data);
		}).catch(function(err){
			document.getElementById("result").textContent = "Error: " + err;
		})
}
function buildDisplay(d){
	var iconUrl = "https://openweathermap.org/img/wn/"
                + d.weather[0].icon + "@2x.png";
	return ''
	+ '<div class="weather-card">'
      +   '<div class="card-top">'
      +     '<img src="' + iconUrl + '" alt="weather icon" class="weather-icon">'
      +     '<div class="card-main">'
      +       '<h2>' + d.name + ', ' + d.sys.country + '</h2>'
      +       '<p class="description">' + d.weather[0].description + '</p>'
      +       '<span class="temp">' + Math.round(d.main.temp) + ' Kelvin</span>'
      +     '</div>'
      +   '</div>'
      +   '<div class="card-details">'
      +     '<div class="detail">'
      +       '<span class="label">Feels Like</span>'
      +       '<span class="value">' + Math.round(d.main.feels_like) + ' Kelvin</span>'
      +     '</div>'
      +     '<div class="detail">'
      +       '<span class="label">Humidity</span>'
      +       '<span class="value">' + d.main.humidity + '%</span>'
      +     '</div>'
      +     '<div class="detail">'
      +       '<span class="label">Wind</span>'
      +       '<span class="value">' + d.wind.speed + ' m/s</span>'
      +     '</div>'
      +     '<div class="detail">'
      +       '<span class="label">Pressure</span>'
      +       '<span class="value">' + d.main.pressure + ' hPa</span>'
      +     '</div>'
      +   '</div>'
      + '</div>';
}

	//Pressing enter to trigger search
	document.getElementById("city").addEventListener("keydown",function(e){
		if(e.key === "Enter") getWeather();
	});


