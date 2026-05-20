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
    console.log(data);
    return data;
  } catch (error) {
    console.error("Error fetching weather data:", error);
  }
}

getWeatherData("London", "C");
