import { Meteo } from './Meteo';

(function() {
  document.getElementById('form-by-city').addEventListener('submit', function(e) {
    e.preventDefault();
    const data = Meteo.byCity(this.elements['city'].value);
    console.log(data);
  });

  document.getElementById('form-by-lat-lng').addEventListener('submit', function(e) {
    e.preventDefault();
    const data = Meteo.byLatLng(this.elements['lat'].value, this.elements['lng'].value);
    console.log(data);
  });
})();