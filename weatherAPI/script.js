// ========== CONFIG ==========
const apiKey = "f07b4ed4d413d7a1052b5710d1c4619";


// DOM Elements
const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const weatherResult = document.getElementById("weatherResult");
const forecastDiv = document.getElementById("forecast");
const unitToggle = document.getElementById("unitToggle");

let isCelsius = true;

// ========== FUNCTIONS ==========

// Fetch current weather
async function getWeather(city) {
  const unit = isCelsius ? "metric" : "imperial";
  const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${unit}`);
  const data = await res.json();

  if (data.cod !== 200) {
    weatherResult.innerHTML = `<p>❌ City not found.</p>`;
    forecastDiv.innerHTML = "";
    return;
  }

  const icon = data.weather[0].icon;
  const tempUnit = isCelsius ? "°C" : "°F";

  weatherResult.innerHTML = `
    <h2>${data.name}</h2>
    <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${data.weather[0].description}">
    <p>${data.weather[0].description}</p>
    <h3>${Math.round(data.main.temp)}${tempUnit}</h3>
  `;

  getForecast(city);
}

// Fetch 5-day forecast
async function getForecast(city) {
  const unit = isCelsius ? "metric" : "imperial";
  const res = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=${unit}`);
  const data = await res.json();

  if (data.cod !== "200") {
    forecastDiv.innerHTML = "";
    return;
  }

  const forecastList = data.list.filter(item => item.dt_txt.includes("12:00:00"));
  forecastDiv.innerHTML = forecastList.map(day => {
    const date = new Date(day.dt_txt);
    const icon = day.weather[0].icon;
    const temp = Math.round(day.main.temp);
    const tempUnit = isCelsius ? "°C" : "°F";
    return `
      <div class="forecast-day">
        <h4>${date.toLocaleDateString("en-US", { weekday: "short" })}</h4>
        <img src="https://openweathermap.org/img/wn/${icon}.png" alt="${day.weather[0].description}">
        <p>${temp}${tempUnit}</p>
      </div>
    `;
  }).join("");
}

// ========== EVENTS ==========
searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (city) getWeather(city);
});

unitToggle.addEventListener("change", () => {
  isCelsius = !unitToggle.checked;
  const currentCity = document.querySelector(".weather-result h2");
  if (currentCity) getWeather(currentCity.textContent);
});
