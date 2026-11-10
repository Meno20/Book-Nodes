function getWeather(){
	var city = document.getElementById("city").value;
	var key = "APIKEY"
	var url = "" + city + "" + key + "";
	
	fetch(url)
		.then(function(res){return res.json();})
		.then(function(data){
			document.getElementById("result".textContent = JSON.strigify(data,null,2);
		})
		.catch(function(err){
			document.getElementById("result").tectContent = "Error: " + err;
		})	
	}

}