function Meteo() {}

Meteo.prototype.previsionMeteoUrl = function() {
  return 'https://www.prevision-meteo.ch/services/json/';
}

Meteo.prototype.byCity = function(city) {
  return this.fetchPrevisionMeteo(this.previsionMeteoUrl() + city);
}

Meteo.prototype.byLatLng = function(lat, lng) {
  return this.fetchPrevisionMeteo(this.previsionMeteoUrl() + 'lat=' + lat + 'lng=' + lng);
}

Meteo.prototype.fetchPrevisionMeteo = function(url) {
  const _this = this;

  return fetch(url)
  .then(function(response) {
    return response.json();
  })
  .then(function(json) {
    return _this.formatData(json);
  });
}

Meteo.prototype.formatData = function(data) {
  if (typeof data.errors !== 'undefined') {
    return data.errors;
  }

  let formattedMeteo = {};

  // City info
  formattedMeteo.city       = data.city_info.name;
  formattedMeteo.country    = data.city_info.country;
  formattedMeteo.latitude   = data.city_info.latitude;
  formattedMeteo.longitude  = data.city_info.longitude;
  formattedMeteo.elevation  = data.city_info.elevation;
  formattedMeteo.sunrise    = data.city_info.sunrise;
  formattedMeteo.sunset     = data.city_info.sunset;

  // Meteo by day
  formattedMeteo.meteo = [];
  for (let i = 0; i <= 4; i++) {
      const attribute = 'fcst_day_' + i;
      const explodedDataDate = data[attribute].date.split('.');

      let day       = {};

      day.date      = new Date(explodedDataDate[0], explodedDataDate[1], explodedDataDate[2]);
      day.weather   = data[attribute].condition_key;
      day.icon      = data[attribute].icon;
      day.icon_big  = data[attribute].icon_big;

      day.temperature      = {};
      day.temperature.min  = data[attribute].tmin;
      day.temperature.max  = data[attribute].tmax;

      day.hours = [];
      let hours = data[attribute].hourly_data;
      for (let key in hours) {
        let hourFormatted = {};

        hourFormatted.icon                  = hours[key].ICON;
        hourFormatted.weather               = hours[key].CONDITION_KEY;
        hourFormatted.temperature           = hours[key].TMP2m;
        hourFormatted.dew_point             = hours[key].DPT2m;
        hourFormatted.relative_humidity     = hours[key].RH2m;
        hourFormatted.atmospheric_pressure  = hours[key].PRMSL;
        hourFormatted.rainfall              = hours[key].APCPsfc;
        hourFormatted.is_snow               = hours[key].ISSNOW;
        hourFormatted.isotherm_at_0         = hours[key].HGT0C;
        hourFormatted.storm_risk            = hours[key].KINDEX;
        hourFormatted.cape180_0             = hours[key].CAPE180_0;
        hourFormatted.cin180_0              = hours[key].CIN180_0;

        // Wind infos
        hourFormatted.wind                  = {};
        hourFormatted.wind.speed            = hours[key].WNDSPD10m;
        hourFormatted.wind.direction_radius = hours[key].WNDDIR10m;
        hourFormatted.wind.direction        = hours[key].WNDDIRCARD10;
        hourFormatted.wind.gust_at_10kmh    = hours[key].WNDGUST10m;
        hourFormatted.wind.chill            = hours[key].WNDCHILL2m;

        // Clouds at different altitudes
        hourFormatted.clouds          = {};
        hourFormatted.clouds.high     = hours[key].HCDC;
        hourFormatted.clouds.average  = hours[key].MCDC;
        hourFormatted.clouds.low      = hours[key].LCDC;

        day.hours.push(hourFormatted);
      }

      formattedMeteo.meteo.push(day);
  }
  console.log(formattedMeteo);

  return formattedMeteo;
}