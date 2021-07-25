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

										// dynamically create html elements using this object.
										var currentCityEl = document.createElement("h1");
										// add text to created elements
										currentCityEl.textContent = lookupLocation.toUpperCase();
										// append created elements
										currentWeatherEl.appendChild(currentCityEl);

										// create current-weather container
										var currentDateEl = document.createElement("h2");
										// add text to created elements
										currentDateEl.textContent = currentWeather.todaysDate;
										// append created elements
										currentWeatherEl.appendChild(currentDateEl);

										// create current-weather container
										var currentTempEl = document.createElement("div");
										// add text to created elements
										currentTempEl.textContent = currentWeather.temp + "℉";
										// append created elements
										currentWeatherEl.appendChild(currentTempEl);

										// create current-weather container
										var currentIconEl = document.createElement("img");
										// add text to created elements
										currentIconEl.setAttribute("src", "http://openweathermap.org/img/wn/" + currentWeather.weatherIcon + "@2x.png");
										// append created elements
										currentWeatherEl.appendChild(currentIconEl);

										// create current-weather container
										var currentHumidityEl = document.createElement("div");
										// add text to created elements
										currentHumidityEl.textContent = "Humidity: " + currentWeather.humidity + "%";
										// append created elements
										currentWeatherEl.appendChild(currentHumidityEl);

										// create current-weather container
										var currentWindEl = document.createElement("div");
										// add text to created elements
										currentWindEl.textContent = "Wind Speed: " + currentWeather.windSpeed + "MPH";
										// append created elements
										currentWeatherEl.appendChild(currentWindEl);

										// create current-weather container
										var currentUVEl = document.createElement("div");
										// add text to created elements
										currentUVEl.textContent = "UV Index: " + currentWeather.UVindex;
										// append created elements
										currentWeatherEl.appendChild(currentUVEl);

										




										console.log(currentWeather);

										for (var i = 0; i < 5; i++) {
											var fiveDayForecast = {
												forecastDate: moment.unix(forecastData.daily[i].dt).format("M/D/YYYY"),
												forecastTemp: forecastData.daily[i].temp,
												forecastHumidity: forecastData.daily[i].humidity,
												forecastWind: forecastData.daily[i].wind_speed,
												forecastIcon: forecastData.daily[i].weather[0].icon
											}
											console.log(fiveDayForecast);
										}

										// using a for loop(?)(or in this^ for loop) dynamically create html elements using these objects


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



