var apiKey = "d248e86769ff3a40ac703128046316a7";
var iconUrl = "http://openweathermap.org/img/wn/{var}@2x.png"
var currentWeatherDay = null;
var futureWeatherDays = [];

function WeatherDay(temp, windSpeed, humidity, uvIndex, icon, time)
{
    this.temp = temp;
    this.windSpeed = windSpeed;
    this.humidity = humidity;
    this.uvIndex = uvIndex;
    this.icon = icon;
    this.time = time;
}

function getCurrentWeatherData(searchTerm)
{
    var apiString = "https://api.openweathermap.org/data/2.5/weather?appid=" + apiKey + "&q=" + searchTerm.trim();

    fetch(apiString)
        .then(function(response)
        {
            if(response.ok)
            {
                return response.json();
            }
            else
            {
                throw Error(response.statusText);
            }
        })
        .then(function(data)
        {
            console.log(data);
            var lat = data.coord.lat;
            var lon = data.coord.lon;

            getOneCallWeatherData(lat, lon);
        })
        .catch(function(error)
        {
            //TODO: Replace with better handling
            alert(error);
        });
}

function getOneCallWeatherData(lat, lon)
{
    var apiString = "https://api.openweathermap.org/data/2.5/onecall?appid=" + apiKey + "&lat="+ lat +"&lon=" + lon + "&units=imperial&exclude=minutely,hourly,alerts";
    fetch(apiString)
        .then(function(response)
        {
            if(response.ok)
            {
                return response.json();
            }
            else
            {
                throw Error(response.statusText);
            }
        })
        .then(function(data)
        {
            console.log(data);

            currentWeatherDay = new WeatherDay(data.current.temp, data.current.wind_speed, data.current.humidity, data.current.uvi, data.current.weather[0].icon, data.current.dt);
            var currentTime = moment(currentWeatherDay.time, "X");
            console.log(currentTime.format("dddd MM/DD/YYYY"));
            for(var i = 1; i < data.daily.length; i++)
            {
                var weatherDay = new WeatherDay(data.daily[i].temp.max, data.daily[i].wind_speed, data.daily[i].humidity, data.daily[i].uvi, data.daily[i].weather[0].icon, data.daily[i].dt);
                futureWeatherDays.push(weatherDay);
                var currentTime = moment(futureWeatherDays[i - 1].time, "X");
                console.log(currentTime.format("dddd MM/DD/YYYY"));
            }
            displayData();
        })
        .catch(function(error)
        {
            //TODO: Replace with better handling
            alert(error);
        });
}

function displayData()
{

}

getCurrentWeatherData("Duluth");