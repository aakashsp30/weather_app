const API_KEY = "NAWHXW6KBWDKTR5VXA4KC98MZ";

async function getWeatherData(location, unit) {
  const unitGroup = unit === "F" ? "us" : "metric";
  const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=${unitGroup}&key=${API_KEY}&contentType=json`;

  try {
    showLoading();

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Location not found: ${response.status}`);
    }

    const data = await response.json();
    const processed = processWeatherData(data);
    return processed;
  } catch (error) {
    console.error("Error fetching weather data:", error);
  } finally {
    hideLoading();
  }
}

function processWeatherData(data) {
  return {
    location: data.resolvedAddress,
    temperature: data.currentConditions.temp,
    feelsLike: data.currentConditions.feelslike,
    humidity: data.currentConditions.humidity,
    condition: data.currentConditions.conditions,
    icon: data.currentConditions.icon,
    description: data.description,
  };
}

let currentUnit = "C";
let currentLocation = "";

const form = document.getElementById("weather-form");
const input = document.getElementById("location-input");
const toggleBtn = document.getElementById("toggle-unit");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const location = input.value.trim();

  if (!location) return;

  currentLocation = location;

  const data = await getWeatherData(location, currentUnit);
  displayWeather(data);
});

toggleBtn.addEventListener("click", async () => {
  if (currentUnit == "C") {
    currentUnit = "F";
    toggleBtn.textContent = "Switch to °C";
  } else {
    currentUnit = "C";
    toggleBtn.textContent = "Switch to °F";
  }

  if (currentLocation) {
    const data = await getWeatherData(currentLocation, currentUnit);
    displayWeather(data);
  }
});

function displayWeather(data) {
  const display = document.getElementById("weather-display");

  display.innerHTML = `
  <div class="weather-card">
    <h2>${data.location}</h2>
    <p class="temperature">${data.temperature}°${currentUnit}</p>
    <p class="condition">${data.condition}</p>
    <p class="feels-like">Feels like: ${data.feelsLike}°${currentUnit}</p>
    <p class="humidity">Humidity: ${data.humidity}%</p>
    <p class="description">${data.description}</p>
  </div>
  `;

  setBackground(data.icon);
}

function setBackground(icon) {
  const body = document.body;

  if (icon.includes("rain")) {
    body.className = "rainy";
  } else if (icon.includes("snow")) {
    body.className = "snowy";
  } else if (icon.includes("cloud")) {
    body.className = "cloudy";
  } else if (icon.includes("clear") || icon.includes("sun")) {
    body.className = "sunny";
  } else {
    body.className = "";
  }
}

const loading = document.getElementById("loading");
const weatherDisplay = document.getElementById("weather-display");
function showLoading() {
  loading.style.display = "block";
  weatherDisplay.innerHTML = "";
}

function hideLoading() {
  loading.style.display = "none";
}
