document.getElementById("getWeather").addEventListener("click", function () {
  const output = document.getElementById("weatherResult");
  output.textContent = "Getting your weather info...";

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
          const temperature = info.main.temp;
          const weatherDesc = info.weather[0].description;

          output.innerHTML = `
            <strong>${cityName}</strong><br>
            🌡️${temperature}°C<br>
             ☁️${weatherDesc}
          `;
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
