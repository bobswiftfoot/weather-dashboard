var apiKey = "d248e86769ff3a40ac703128046316a7";
var iconUrl = "http://openweathermap.org/img/wn/{var}@2x.png"
var city = "";
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
    city = searchTerm;
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
    var imgSrc = "http://openweathermap.org/img/wn/{0}@2x.png";
    //Create Current Weather Card
    var cardBody = $("<div>").addClass("card-body");
    var currentTime = moment(currentWeatherDay.time, "X");
    var cardHeader = $("<h3>").addClass("card-title").text(city + currentTime.format(" (dddd MM/DD/YYYY)"));
    var cardImg = $("<img>").attr("src", imgSrc.replace("{0}", currentWeatherDay.icon));
    var cardTemp = $("<p>").addClass("card-text").text("Temp: " + currentWeatherDay.temp);
    var cardWindSpeed = $("<p>").addClass("card-text").text("Wind Speed: " + currentWeatherDay.windSpeed);
    var cardHumidity = $("<p>").addClass("card-text").text("Humidity: " + currentWeatherDay.humidity);
    var cardUVIndex = $("<p>").addClass("card-text").text("UV Index: " + currentWeatherDay.uvIndex);

    cardBody.append(cardHeader, cardImg, cardTemp, cardWindSpeed, cardHumidity, cardUVIndex);
    $(".current-weather").empty();
    $(".current-weather").append(cardBody);

    $(".future-weather").empty();
    for(var i = 0; i < 5; i++)
    {
        //Create Future Weather Card
        var cardColumn = $("<div>").addClass("card col-2 m-2 bg-info");
        var cardBody = $("<div>").addClass("card-body");
        var currentTime = moment(futureWeatherDays[i].time, "X");
        var cardHeader = $("<h4>").addClass("card-title").text(currentTime.format("dddd"));
        var cardDate = $("<h5>").addClass("card-text").text(currentTime.format("(MM/DD/YYYY)"));
        var cardImg = $("<img>").attr("src", imgSrc.replace("{0}", futureWeatherDays[i].icon));
        var cardTemp = $("<p>").addClass("card-text").text("Temp: " + futureWeatherDays[i].temp);
        var cardWindSpeed = $("<p>").addClass("card-text").text("Wind Speed: " + futureWeatherDays[i].windSpeed);
        var cardHumidity = $("<p>").addClass("card-text").text("Humidity: " + futureWeatherDays[i].humidity);
        var cardUVIndex = $("<p>").addClass("card-text").text("UV Index: " + futureWeatherDays[i].uvIndex);

        cardBody.append(cardHeader, cardDate, cardImg, cardTemp, cardWindSpeed, cardHumidity, cardUVIndex);
        cardColumn.append(cardBody);
        $(".future-weather").append(cardColumn);
    }
}

getCurrentWeatherData("Duluth");