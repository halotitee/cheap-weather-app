(function() {
    // Building weather API
    let DARKSKY_API_URL = 'https://api.darksky.net/forecast/';
    let DARKSKY_API_KEY = '86669f54b0c54457c00ea278533f42b2';
    let CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';

    let GOOGLE_MAPS_API_KEY = 'AIzaSyB8fseKTl75AhXpBw8KocWO0cFTtQCe4vQ';
    let GOOGLE_MAPS_API_URL = 'https://maps.googleapis.com/maps/api/geocode/json';

    // Google AutoComplete
    var input = document.getElementById('autocomplete');
    var options = {
        types: ['(cities)'],
        componentRestrictions: {country: 'ca'}
    };

    autocomplete = new google.maps.places.Autocomplete(input, options);


    // Transform data into html language
    let transform = {};
    transform['clear-day'] = `<img src="./img/clear-day.png" style="width: 50px">`;
    transform['clear-night'] = `<img src="./img/clear-night.png" style="width: 50px">`;
    transform['rain'] = `<img src="./img/rain.png" style="width: 50px">`;
    transform['snow'] = `<img src="./img/snow.png" style="width: 50px">`;
    transform['sleet'] = `<img src="./img/sleet.png" style="width: 50px">`;
    transform['wind'] = `<img src="./img/wind.png" style="width: 50px">`;
    transform['fog'] = `<img src="./img/fog.png" style="width: 50px">`;
    transform['cloudy'] = `<img src="./img/cloudy.png" style="width: 50px">`;
    transform['partly-cloudy-day'] = `<img src="./img/partly-cloudy-day.png" style="width: 50px">`;
    transform['partly-cloudy-night'] = `<img src="./img/partly-cloudy-night.png" style="width: 50px">`;
    transform[0] = 'Sunday';
    transform[1] = 'Monday';
    transform[2] = 'Tuesday';
    transform[3] = 'Wednesday';
    transform[4] = 'Thursday';
    transform[5] = 'Friday';
    transform[6] = 'Saturday';


    function getCoordinatesForCity(cityName) {
        let url = `${GOOGLE_MAPS_API_URL}?address=${cityName}&key=${GOOGLE_MAPS_API_KEY}`;

        return (
            fetch(url) // Returns a promise for a Response
                .then(response => response.json()) // Returns a promise for the parsed JSON
                .then(data => data.results[0].geometry.location) // Transform the response to only take what we need
        );
    }

    function getCurrentWeather(coords) {
        let url = `${CORS_PROXY}${DARKSKY_API_URL}${DARKSKY_API_KEY}/${coords.lat},${coords.lng}?units=si`;

        return (
            fetch(url)
                .then(response => response.json())
                .then(data => {
                //console.log(data);
                    return [
                        data.currently,
                        data.daily.data[0],
                        data.daily.data[1],
                        data.daily.data[2],
                        data.daily.data[3],
                        data.daily.data[4],
                        data.daily.data[5],
                        data.daily.data[6]
                    ];
                })
        );
    }

// Wiring it up to the DOM
    let app = document.querySelector('#app');
    let cityForm = app.querySelector('.city-form');
    let cityInput = cityForm.querySelector('.city-input');
    //let getWeatherButton = cityForm.querySelector('.get-weather-button');
    let cityWeather = app.querySelector('.city-weather');


    cityForm.addEventListener('submit', function(event) {
        event.preventDefault();

        let city = cityInput.value;
        getCoordinatesForCity(city)
            .then(getCurrentWeather)
            .then(result => {
                return cityWeather.innerHTML = `
        <div class="currentDay">
          <div class="day"><p>Today</p></div>
          <div class="degree">${transform[result[0].icon]}<h3 style="margin-bottom:0;">Currently: ${result[0].temperature}°C</h3><h5 style="margin-top: 0;">Dew Pt: ${result[0].dewPoint}° Humidity: ${result[0].humidity * 100}%</h5></div>
        </div>

        <div class="separateDays">
          <div class="day"><p>${transform[new Date(result[1].time * 1000).getDay()]}</p></div>
          <div class="degree">${transform[result[1].icon]}<h3>${result[1].temperatureMax}°C/${result[1].temperatureMin}°C</h3></div>
        </div>

        <div class="separateDays">
          <div class="day"><p>${transform[new Date(result[2].time * 1000).getDay()]}</p></div>
          <div class="degree">${transform[result[2].icon]}<h3>${result[2].temperatureMax}°C/${result[2].temperatureMin}°C</h3></div>
        </div>

        <div class="separateDays">
          <div class="day"><p>${transform[new Date(result[3].time * 1000).getDay()]}</p></div>
          <div class="degree">${transform[result[3].icon]}<h3>${result[3].temperatureMax}°C/${result[3].temperatureMin}°C</h3></div>
        </div>

        <div class="separateDays">
          <div class="day"><p>${transform[new Date(result[4].time * 1000).getDay()]}</p></div>
          <div class="degree">${transform[result[4].icon]}<h3>${result[4].temperatureMax}°C/${result[4].temperatureMin}°C</h3></div>
        </div>

        <div class="separateDays">
          <div class="day"><p>${transform[new Date(result[5].time * 1000).getDay()]}</p></div>
          <div class="degree">${transform[result[5].icon]}<h3>${result[5].temperatureMax}°C/${result[5].temperatureMin}°C</h3></div>
        </div>

        <div class="separateDays">
          <div class="day"><p>${transform[new Date(result[6].time * 1000).getDay()]}</p></div>
          <div class="degree">${transform[result[6].icon]}<h3>${result[6].temperatureMax}°C/${result[6].temperatureMin}°C</h3></div>
        </div>
        `
            });


    });
    /*getWeatherButton.addEventListener('click', function () {
        let city = cityinput.value;

        getCoordinatesForCity(city)
            .then(getCurrentWeather)
            .then(function(weather) {
                cityWeather.innerText = 'Current temperature: ' + weather.temperature;
            });
    });*/
})();
