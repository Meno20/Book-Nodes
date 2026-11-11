function getWeather(){
	var city = document.getElementById("city").value.trim(); //trim() to remove any uncessary space
	var key = "a146e5a7fdf952fe9255e70ea6fe1d3e"
	//web address the request will be sent to
	var url = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + key;
	
	fetch(url)
		.then(function(res){return res.json();})// convert the reponse from the website from JSON to a JS object to be usable
		.then(function(data){
			document.getElementById("result").textContent = JSON.stringify(data,null,2); //convert the JS object back into readable JSON String
		})
		.catch(function(err){
			document.getElementById("result").textContent = "Error: " + err;
		})	
}

