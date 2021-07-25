// variables
var cityInputEl = document.querySelector("#city-name");
var stateInputEl = document.querySelector("#state-code");
var searchButtonEl = document.querySelector("#search-btn");
var currentWeatherEl = document.querySelector("#current-weather");



var searchSubmitHandler = function () {
	// get value from input
	var cityName = cityInputEl.value.trim();
	var stateName = stateInputEl.value.trim();

	localStorage.setItem("city", cityName);
	localStorage.setItem("state", stateName);

	var lookupLocation = cityName + "," + stateName

	console.log(lookupLocation);

	getWeather(lookupLocation);

	//clear old content
	cityInputEl.value = "";
	stateInputEl.value = "";
}

var getWeather = function (lookupLocation) {
	var apiUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + lookupLocation + ",US&appid=933bc50f9aa095b25c8ea39c0e34c2a8";

	fetch(apiUrl)
		.then(function (coordinates) {
			// success
			if (coordinates.ok) {
				return coordinates.json()
					.then(function (data) {
						var latitude = data[0].lat;
						var longitude = data[0].lon;

						return fetch
							("https://api.openweathermap.org/data/2.5/onecall?lat=" +
								latitude +
								"&lon=" +
								longitude +
								"&exclude=minutely,hourly,alerts&units=imperial&appid=933bc50f9aa095b25c8ea39c0e34c2a8")
							.then(function (forecastResponse) {
								return forecastResponse.json()
									.then(function (forecastData) {
										console.log(forecastData);
										

										var currentWeather = {
											todaysDate: moment.unix(forecastData.current.dt).format("M/D/YYYY"),
											temp: forecastData.current.temp,
											humidity: forecastData.current.humidity,
											windSpeed: forecastData.current.wind_speed,
											UVindex: forecastData.current.uvi,
											weatherIcon: forecastData.current.weather[0].icon
										}
										console.log(currentWeather);

										for (var i = 0; i < 5; i ++) {
											var fiveDayForecast = {
												forecastDate: moment.unix(forecastData.daily[i].dt).format("M/D/YYYY"),
												forecastTemp: forecastData.daily[i].temp,
												forecastHumidity: forecastData.daily[i].humidity,
												forecastWind: forecastData.daily[i].wind_speed,
												forecastIcon: forecastData.daily[i].weather[0].icon
											}
											console.log(fiveDayForecast);
										}
										
									})
							})
					});
			} else {
				alert("Error: City not found. Please try again.");
			}
		})
};



// event listeners
searchButtonEl.addEventListener("click", searchSubmitHandler);



