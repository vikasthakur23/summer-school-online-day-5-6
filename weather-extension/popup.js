document.getElementById("getWeather").addEventListener("click", function () {
  const output = document.getElementById("weatherResult");
  const isFahrenheit = document.getElementById("unitToggle").checked;

  output.style.display = "block";
  output.innerHTML = `
    <p>⏳ Getting your weather info...</p>
    <img src="icons/4.gif" width="40" />
  `;

  if (!navigator.geolocation) {
    output.textContent = "Your browser doesn't support location access.";
    return;
  }

  navigator.geolocation.getCurrentPosition(handleSuccess, handleError);

  function handleSuccess(pos) {
    const latitude = pos.coords.latitude;
    const longitude = pos.coords.longitude;
    const myAPIKey = "cf424f4fec74acccdd1ce7e2f0bbfa82";
    const apiURL = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${myAPIKey}&units=metric`;

    fetch(apiURL)
      .then(res => res.json())
      .then(info => {
        if (info.cod === 200) {
          const cityName = info.name;
          const temperatureC = info.main.temp;
          const weatherDesc = info.weather[0].description;
          const weatherCondition = info.weather[0].main.toLowerCase();

          let displayTemp = temperatureC;
          let unit = "°C";

          if (isFahrenheit) {
            displayTemp = (temperatureC * 9) / 5 + 32;
            unit = "°F";
          }

          let conditionIcon = "default.png";
          switch (weatherCondition) {
            case 'clear': conditionIcon = "clear.png"; break;
            case 'clouds': conditionIcon = "clouds.png"; break;
            case 'rain': conditionIcon = "rain.png"; break;
            case 'snow': conditionIcon = "snow.png"; break;
            case 'mist':
            case 'fog':
            case 'haze': conditionIcon = "mist.png"; break;
            case 'thunderstorm': conditionIcon = "thunderstorm.png"; break;
          }

          let tempIcon = "default.png";
          const tempC = temperatureC;
          const tempToCompare = isFahrenheit ? (displayTemp - 32) * 5 / 9 : tempC;

          if (tempToCompare <= 0) {
            tempIcon = "snow.png";
          } else if (tempToCompare <= 15) {
            tempIcon = "cold.png";
          } else if (tempToCompare <= 25) {
            tempIcon = "mild.png";
          } else if (tempToCompare <= 35) {
            tempIcon = "sunny.png";
          } else {
            tempIcon = "hot.png";
          }

          output.innerHTML = `
            <h2>🌍 ${cityName}</h2>
            <p>🌡️ ${displayTemp.toFixed(1)}${unit}</p>
            <p>⛅ ${weatherDesc}</p>
            <img src="icons/${conditionIcon}" width="60" alt="Condition Icon" /><br>
            <img src="icons/${tempIcon}" width="40" alt="Temp Icon" />
          `;

          const weatherData = {
            cityName,
            temperature: displayTemp.toFixed(1),
            weatherDesc,
            conditionIcon,
            tempIcon,
            unit
          };
          localStorage.setItem("lastWeather", JSON.stringify(weatherData));
        } else {
          output.textContent = "Couldn't get the weather right now.";
        }
      })
      .catch(() => {
        output.textContent = "Problem reaching weather service.";
      });
  }

  function handleError() {
    output.textContent = "Please allow location access to continue.";
  }
});
