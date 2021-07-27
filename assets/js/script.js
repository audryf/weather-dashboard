// variables
var cityInputEl = document.querySelector("#city-name");
var stateInputEl = document.querySelector("#state-code");
var searchButtonEl = document.querySelector("#search-btn");
var currentWeatherEl = document.querySelector("#current-weather");
var savedSearchesEl = document.querySelector(".saved-searches");

var renderSearches = function(searches) {
	savedSearchesEl.innerHTML = ""
	for (var i = 0; i < searches.length; i++) {
		var searchesButtonEl = document.createElement("button");
		searchesButtonEl.innerHTML = searches[i].city + ", " + searches[i].state;
		searchesButtonEl.classList.add("btn", "btn-secondary");
		savedSearchesEl.appendChild(searchesButtonEl);
	}
};

if (localStorage.getItem("searches")) {
	var searches = JSON.parse(localStorage.getItem("searches"));
	renderSearches(searches);
} else {
	var searches = []
}

var searchSubmitHandler = function () {
	// get value from input
	var cityName = cityInputEl.value.trim();
	var stateName = stateInputEl.value.trim();

	var search = {
		city: cityName,
		state: stateName
	}
	searches.push(search)
	renderSearches(searches)
	localStorage.setItem("searches", JSON.stringify(searches));
	

	var lookupLocation = cityName + "," + stateName

	getWeather(lookupLocation);

	//clear old content
	cityInputEl.value = "";
	stateInputEl.value = "";
};




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

										currentWeatherEl.textContent = "";
										// dynamically create html elements using this object.
										var currentCityEl = document.createElement("h1");
										currentCityEl.textContent = lookupLocation.toUpperCase();
										currentWeatherEl.appendChild(currentCityEl);

										var currentDateEl = document.createElement("h2");
										currentDateEl.textContent = currentWeather.todaysDate;
										currentWeatherEl.appendChild(currentDateEl);

										var currentTempEl = document.createElement("div");
										currentTempEl.textContent = currentWeather.temp + "℉";
										currentWeatherEl.appendChild(currentTempEl);

										var currentIconEl = document.createElement("img");
										currentIconEl.setAttribute("src", "http://openweathermap.org/img/wn/" + currentWeather.weatherIcon + "@2x.png");
										currentWeatherEl.appendChild(currentIconEl);

										var currentHumidityEl = document.createElement("div");
										currentHumidityEl.textContent = "Humidity: " + currentWeather.humidity + "%";
										currentWeatherEl.appendChild(currentHumidityEl);

										var currentWindEl = document.createElement("div");
										currentWindEl.textContent = "Wind Speed: " + currentWeather.windSpeed + "MPH";
										currentWeatherEl.appendChild(currentWindEl);

										var currentUVEl = document.createElement("div");
										currentUVEl.textContent = "UV Index: " + currentWeather.UVindex;
										currentWeatherEl.appendChild(currentUVEl);





										var fiveDayEl = document.querySelector("#five-day")
										console.log(currentWeather);
										fiveDayEl.innerHTML = ""
										for (var i = 0; i < 5; i++) {
											var fiveDayForecast = {
												forecastDate: moment.unix(forecastData.daily[i].dt).format("M/D/YYYY"),
												forecastTemp: forecastData.daily[i].temp.day,
												forecastHumidity: forecastData.daily[i].humidity,
												forecastWind: forecastData.daily[i].wind_speed,
												forecastIcon: forecastData.daily[i].weather[0].icon
											}
											console.log()
											console.log(fiveDayForecast);


											// using a for loop(?)(or in this^ for loop) dynamically create html elements using these objects
											
											
											var cardEl = document.createElement("div");
											cardEl.classList.add("card");

											var futureTitleEl = document.createElement("h5");
											futureTitleEl.classList.add("card-title");

											var futureBodyEl = document.createElement("p");
											futureBodyEl.classList.add("card-text");

											var forecastDateEl = document.createElement("div");
											forecastDateEl.textContent = fiveDayForecast.forecastDate;
											futureTitleEl.appendChild(forecastDateEl);

											var futureTempEl = document.createElement("div");
											futureTempEl.textContent = fiveDayForecast.forecastTemp + "℉";
											futureTitleEl.appendChild(futureTempEl);


											var futureIconEl = document.createElement("img");
											futureIconEl.setAttribute("src", "http://openweathermap.org/img/wn/" + fiveDayForecast.forecastIcon + "@2x.png");
											futureBodyEl.appendChild(futureIconEl);

											var futureHumidityEl = document.createElement("div");
											futureHumidityEl.textContent = "Humidity: " + fiveDayForecast.forecastHumidity + "%";
											futureBodyEl.appendChild(futureHumidityEl);

											var futureWindEl = document.createElement("div");
											futureWindEl.textContent = "Wind Speed: " + fiveDayForecast.forecastWind + "MPH";
											futureBodyEl.appendChild(futureWindEl);

											cardEl.appendChild(futureTitleEl);
											cardEl.appendChild(futureBodyEl);
											fiveDayEl.appendChild(cardEl);

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

savedSearchesEl.addEventListener("click", function(event) {
	console.log(event.target);
	getWeather(event.target.innerHTML);
})

