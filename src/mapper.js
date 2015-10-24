import Leaflet from 'leaflet';

export default class Mapper extends Leaflet.Class {
  init() {
    const map = Leaflet.map('map');
    map.setView([51.505, -0.09], 13);
    let osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    let osmAttrib='Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
    Leaflet.tileLayer(osmUrl, {minZoom: 8, maxZoom: 18, attribution: osmAttrib}).addTo(map);
  }
}
