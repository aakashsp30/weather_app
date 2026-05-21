const API_KEY = "NAWHXW6KBWDKTR5VXA4KC98MZ";

async function getWeatherData(location, unit) {
  const unitGroup = unit === "F" ? "us" : "metric";
  const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=${unitGroup}&key=${API_KEY}&contentType=json`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Location not found: ${response.status}`);
    }

    const data = await response.json();
    const processed = processWeatherData(data);
    return processed;
  } catch (error) {
    console.error("Error fetching weather data:", error);
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

const form = document.getElementById("weather-form");
const input = document.getElementById("location-input");
const toggleBtn = document.getElementById("toggle-unit");

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const location = input.value.trim();

  if (!location) return;

  const data = await getWeatherData(location, currentUnit);
  console.log(data);
});

toggleBtn.addEventListener("click", () => {
  if (currentUnit == "C") {
    currentUnit = "F";
    toggleBtn.textContent = "Switch to °C";
  } else {
    currentUnit = "C";
    toggleBtn.textContent = "Switch to °F";
  }
});
