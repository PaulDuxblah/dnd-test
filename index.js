(function() {
  let meteo = new Meteo();

  // Fetch the data when submitting the 'city' form
  document.getElementById('form-by-city').addEventListener('submit', function(e) {
    e.preventDefault();

    displayLoading();

    meteo.byCity(this.elements['city'].value)
    .then(function() { 
      displayData();
    });
  });

  // Fetch the data when submitting the 'lat-lng' form
  document.getElementById('form-by-lat-lng').addEventListener('submit', function(e) {
    e.preventDefault();

    displayLoading();

    meteo.byLatLng(this.elements['lat'].value, this.elements['lng'].value)
    .then(function() { 
      displayData();
    });
  });

  // Display a message telling the user the data is being fetched
  function displayLoading() {
    document.getElementById('nav').innerHTML = '';
    document.getElementById('day').innerHTML = '';
    document.getElementById('title').innerHTML = 'Veuillez patienter...';
  }

  // Display a message to the user depending of the error
  function displayError() {
    document.getElementById('title').innerHTML = (function () {
      switch (parseInt(meteo.errors[0].code)) {
        case 11: return 'Cette ville ou ce lieu n\'est pas disponible.';
        case 20: return 'Ce lieu est hors d\'atteinte.';
        default: return '';
      }
    })();
  }

  // Returns the <li> in the nav
  function navLi() {
    return document.getElementById('nav').getElementsByTagName('li');
  }

  // Creates a array from navLi() to be able to use forEach
  function arrayNavLi() {
    return Array.from(navLi());
  }

  // Displays the data of the day selected by the user
  function displayDay() {
    const thisAttrDay = this.getAttribute('data-day');

    // Sets the current tab as active
    arrayNavLi().forEach(function(li) {
      li.classList.remove('active');

      if (li.getAttribute('data-day') === thisAttrDay) {
        li.classList.add('active');
      }
    });

    // Get the selected day's data
    let dayData = {};
    meteo.days.forEach(function(day) {
      if (day.date.getDate() == thisAttrDay) {
        dayData = day;
        return;
      }
    });

    // Display the day's data
    var day = '<div class="header">';
    day += '<img src="' + dayData.icon_big + '" />';
    day += '<p></p>';
    day += '<p>Températures entre ' + dayData.temperature.min + '° et ' + dayData.temperature.max + '°</p>';
    day += '</div>';

    day += '<div id="hours">';
    dayData.hours.forEach(function(data, hour) {
      day += '<div>';
        day += '<div class="header">';
          day += '<h3>' + hour + 'h</h3>';
          day += '<img src="' + data.icon + '" />';
        day += '</div>';
        day += '<p>Température : ' + data.temperature + '°</p>';
        day += '<p>Vent : ' + data.wind.speed + ' km/h</p>';
        day += '<p>Pression atmosphérique : ' + data.atmospheric_pressure + '</p>';
      day += '</div>';
    });
    day += '</div>';

    document.getElementById('day').innerHTML = day;
  }

  // Add the event listener on tabs
  function enableTabs() {
    arrayNavLi().forEach(function(li) {
      li.onclick = displayDay;
    });
  }

  // Displays the content loaded from Meteo
  function displayData() {
    // Check if the fetch returned an error
    if (meteo.errors) {
      displayError();
      return;
    }

    // The days and months in french
    const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

    // Set location in title
    document.getElementById('title').innerHTML = meteo.country + ': ' + meteo.city + ' (' + meteo.latitude + ', ' + meteo.longitude + ')';
    
    // Display the nav
    let nav = '<ul>';
    meteo.days.forEach(function(day, key) {
      nav += '<li data-day="' + day.date.getDate() + '">';
      nav += days[day.date.getDay()];
      nav += ' '
      nav += day.date.getDate()
      nav += ' ';
      nav += months[day.date.getMonth()];
      nav += '</li>';
    });
    nav += '</ul>';

    document.getElementById('nav').innerHTML = nav;

    // Add the listeners to the tabs we just created
    enableTabs();

    // Starts on the first tab
    navLi()[0].click();
  }
})();