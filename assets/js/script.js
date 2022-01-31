const cardContainer = document.querySelector(".card-container");
let formInput = document.querySelector("#form-input");
const userSearchForm = document.querySelector("#user-search");
const searchBtn = document.querySelector(".btn-primary");
let cityTitle = document.querySelector(".city-name");
const currentTempSpan = document.querySelector(".temp");
let currentDayIcon = document.querySelector(".current-day-icon");

let currentDate = new Date();
let formattedDate =
  currentDate.getDate() +
  "-" +
  (currentDate.getMonth() + 1) +
  "-" +
  currentDate.getFullYear();

const currentWindSpan = document.querySelector(".wind");
const currentHumiditySpan = document.querySelector(".humidity");
const currentUVSpan = document.querySelectorAll(".uv");
let cities = [];
if (localStorage.getItem("city")) {
  cities = JSON.parse(localStorage.getItem("city"));
}

const getCityWeather = function (city) {
  let forecastUrl =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    ",us&units=imperial&appid=5a6cd3cd3465a3028e3882c5bc7138c2";

  fetch(forecastUrl)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          console.log(data, city);
          let date = new Date(data.dt * 1000);
          console.log(date);
          console.log(date.toLocaleDateString());

          let iconId = data.weather[0].icon;
          let imgUrl = ` http://openweathermap.org/img/wn/${iconId}@2x.png`;
          console.log(imgUrl);
          nestedRequest(data.coord.lat, data.coord.lon, city);
        });
      } else {
        console.log("error");
        alert("Check your spelling");
      }
    })
    .catch(function (error) {
      console.log(error);
    });
};

const nestedRequest = function (lat, lon, city) {
  let forecastUrl =
    "https://api.openweathermap.org/data/2.5/onecall?lat=" +
    lat +
    "&lon=" +
    lon +
    "&units=imperial&appid=5a6cd3cd3465a3028e3882c5bc7138c2";

  fetch(forecastUrl).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        console.log(data);

        cityTitle.textContent = ` ${city} ${formattedDate}`;
        // currentDayIcon = data.current.weather.icon;
        currentTempSpan.textContent = `${Math.floor(data.current.temp)}°F`;
        currentHumiditySpan.textContent = `${data.current.humidity}%`;
        currentWindSpan.textContent = `${data.current.wind_speed} MPH`;
        currentUVSpan.textContent = `${data.current.uvi}`;

        // TODO add futurforecast() on click on title.
        //   futureForecast(cityName);

        for (let i = 1; i <= 5; i++) {
          const cardBodyDiv = document.createElement("div");
          cardBodyDiv.classList = "card-body";
          let cardTitle = document.createElement("h5");
          cardTitle.classList = "card-title";
          // TODO add date for each day
          cardTitle.textContent = `${data.daily[i].dt}`;
          let cardTextTemp = document.createElement("p");
          cardTextTemp.classList = "card-text";
          cardTextTemp.textContent = `Temp: ${Math.floor(
            data.daily[i].temp.day
          )}°F`;
          let cardTextWind = document.createElement("p");
          cardTextWind.classList = "card-text";
          cardTextWind.textContent = `Wind Speed: ${Math.floor(
            data.daily[i].wind_speed
          )} MPH`;
          let cardTextHumid = document.createElement("p");
          cardTextHumid.classList = "card-text";
          cardTextHumid.textContent = `Humidity: ${data.daily[i].humidity}%`;
          cardBodyDiv.appendChild(cardTitle);
          cardBodyDiv.appendChild(cardTextTemp);
          cardBodyDiv.appendChild(cardTextWind);
          cardBodyDiv.appendChild(cardTextHumid);

          cardContainer.appendChild(cardBodyDiv);
        }
      });
    }
  });
};

const cityInputHandler = function (event) {
  event.preventDefault();
  let cityName = formInput.value.trim();

  if (cityName) {
    console.log(cityName);
    getCityWeather(cityName);
    saveCitiesHistory(cityName);

    formInput.value = "";
  } else {
    alert("Please type a city name");
  }
};

// TODO set up local storage for serached cities + display old searches below search button
const saveCitiesHistory = function (cityInput) {
  if (cities.length > 7) {
    cities.splice(0, 1);
  }
  cities.push(cityInput);
  localStorage.setItem("city", JSON.stringify(cities));
};

searchBtn.addEventListener("click", cityInputHandler);
