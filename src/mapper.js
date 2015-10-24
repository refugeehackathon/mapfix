import Leaflet from 'leaflet';

export default class Mapper extends Leaflet.Class {
  init() {
    const map = Leaflet.map('map');
    map.setView([51.505, -0.09], 13);
    window.console.log(map);
  }
}
