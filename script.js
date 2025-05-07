const apiKey = '966185da5b6900d5bfb00960f3320b2b'; // Remplace par ta clé OpenWeatherMap

function getLocationWeather() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showWeatherByCoords, showError);
  } else {
    alert("La géolocalisation n'est pas prise en charge par ce navigateur.");
  }
}

function getCityWeather() {
  const city = document.getElementById("cityInput").value.trim();
  if (!city) return alert("Veuillez entrer un nom de ville.");
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=fr`;
  fetchWeather(url);
}

function showWeatherByCoords(position) {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=fr`;
  fetchWeather(url);
}

function fetchWeather(url) {
  fetch(url)
    .then(response => {
      if (!response.ok) throw new Error("Ville introuvable ou erreur API");
      return response.json();
    })
    .then(data => {
      const { name } = data;
      const temp = data.main.temp;
      const desc = data.weather[0].description;
      const icon = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

      document.getElementById("weather").innerHTML = `
        <p><strong>${name}</strong></p>
        <p>${temp} °C, ${desc}</p>
        <img src="${icon}" alt="${desc}" />
      `;

      updateBackground(data.weather[0].id);
    })
    .catch(err => {
      document.getElementById("weather").innerText = "Erreur : " + err.message;
    });
}

function showError(error) {
  let message = "Erreur de géolocalisation.";
  switch (error.code) {
    case error.PERMISSION_DENIED:
      message = "Permission refusée.";
      break;
    case error.POSITION_UNAVAILABLE:
      message = "Position non disponible.";
      break;
    case error.TIMEOUT:
      message = "La requête a expiré.";
      break;
  }
  document.getElementById("weather").innerText = message;
}

function updateBackground(weatherId) {
  let bg;
  if (weatherId >= 200 && weatherId < 600) bg = '#90a4ae'; // Pluie
  else if (weatherId >= 600 && weatherId < 700) bg = '#eceff1'; // Neige
  else if (weatherId >= 700 && weatherId < 800) bg = '#b0bec5'; // Brouillard
  else if (weatherId === 800) bg = '#ffe082'; // Soleil
  else if (weatherId > 800) bg = '#90caf9'; // Nuages
  else bg = '#e0f7fa';

  document.body.style.backgroundColor = bg;
}
