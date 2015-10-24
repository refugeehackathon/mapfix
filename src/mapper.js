import Leaflet from 'leaflet';

export default class Mapper extends Leaflet.Class {

  constructor(domNode) {
    super();
    const map = Leaflet.map(domNode);
    map.setView([51.505, -0.09], 13);
    const osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    const osmAttrib = 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
    Leaflet.tileLayer(osmUrl, {minZoom: 8, maxZoom: 18, attribution: osmAttrib}).addTo(map);
  }
}
