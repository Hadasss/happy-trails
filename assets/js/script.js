const cardContainer = document.querySelector(".card-container");
const searchHistoryContainer = document.querySelector(".search-history");
let formInput = document.querySelector("#form-input");
const userSearchForm = document.querySelector("#user-search");
const searchBtn = document.querySelector(".searchBtn");
let cityTitle = document.querySelector(".city-name");
const currentTempSpan = document.querySelector(".temp");
let currentDayIcon = document.querySelector(".current-day-icon");
const currentWindSpan = document.querySelector(".wind");
const currentHumiditySpan = document.querySelector(".humidity");
const currentUVSpan = document.querySelectorAll(".uv");
let currentDate = new Date().toLocaleDateString();
let cities = [];

if (localStorage.getItem("city")) {
  cities = JSON.parse(localStorage.getItem("city"));
  console.log(cities);
  const unique = Array.from(new Set(cities));
  console.log(unique);
  for (let j = 0; j < unique.length; j++) {
    let cityBtn = document.createElement("button");
    cityBtn.classList = "button is-primary is-light is-fullwidth block";
    cityBtn.textContent = unique[j];
    searchHistoryContainer.appendChild(cityBtn);
  }
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
          // TODO add icon to current day

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
        console.log(data, city);
        // TODO add icon to current day
        cityTitle.textContent = `${city} (${currentDate})`;
        let iconId = data.current.weather[0].icon;
        let imgUrl = `http://openweathermap.org/img/wn/${iconId}@2x.png`;
        console.log(imgUrl);
        currentDayIcon = `<img src=${imgUrl}>`;
        currentTempSpan.textContent = `${Math.floor(data.current.temp)}°F`;
        currentHumiditySpan.textContent = `${data.current.humidity}%`;
        currentWindSpan.textContent = `${data.current.wind_speed} MPH`;
        currentUVSpan.textContent = `${data.current.uvi}`; // BUG

        // TODO add icon to forecast
        for (let i = 1; i <= 5; i++) {
          var cardBodyDiv = document.createElement("div");
          cardBodyDiv.classList = "card column is-2";
          var cardTitle = document.createElement("h5");
          cardTitle.classList = "card-header card-title";
          var futureDate = new Date(data.daily[i].dt * 1000);
          cardTitle.textContent = futureDate.toLocaleDateString();
          var weatherIcon = document.createElement("img");
          //   weatherIcon.innerHTML = `<img src=${imgUrl}>`;
          var cardTextTemp = document.createElement("p");
          cardTextTemp.classList = "block content card-text";
          cardTextTemp.textContent = `Temp: ${Math.floor(
            data.daily[i].temp.day
          )}°F`;
          var cardTextWind = document.createElement("p");
          cardTextWind.classList = "block content card-text";
          cardTextWind.textContent = `Wind Speed: ${Math.floor(
            data.daily[i].wind_speed
          )} MPH`;
          var cardTextHumid = document.createElement("p");
          cardTextHumid.classList = "block content card-text";
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
  cardContainer.innerHTML = "";

  cityTitle.textContent = "";
  let cityName = formInput.value.trim();

  if (cityName) {
    getCityWeather(cityName);
    saveCitiesHistory(cityName);
    formInput.value = "";

    // TODO display old searches below search button
    // const unique = Array.from(new Set(cities));
    // console.log(unique);
    // for (let j = 0; j < unique.length; j++) {
    //   let cityBtn = document.createElement("button");
    //   cityBtn.textContent = unique[j];
    //   searchHistoryContainer.appendChild(cityBtn);
    // }
  } else {
    alert("Please type a city name");
  }
};

const saveCitiesHistory = function (cityInput) {
  if (cities.length > 7) {
    cities.splice(0, 1);
  }
  cities.push(cityInput);
  localStorage.setItem("city", JSON.stringify(cities));
};

searchBtn.addEventListener("click", cityInputHandler);
