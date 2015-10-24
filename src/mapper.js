import Leaflet from 'leaflet';

export default class Mapper extends Leaflet.Class {

  constructor(domNode) {
    super(domNode);

    const map = Leaflet.map('map', {
      minZoom: 1,
      maxZoom: 18,
      noWrap: true,
      continuousWorld: false,
    });

    const tileUrl
      = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}';
    const attribution
      = '<a href="//openstreetmap.org" target="_blank">OpenStreetMap</a> | <a href="//mapbox.com" target="_blank">Mapbox</a>';
    const token = 'pk.eyJ1IjoiZG9uc2Nob2UiLCJhIjoiMkN5RUk0QSJ9.FGcEYWjfgcJUmSyN1tkwgQ';
    const tiles = Leaflet.tileLayer(tileUrl, {
      attribution: attribution,
      id: 'mapbox.light',
      accessToken: token,
      noWrap: true,
      continuousWorld: false,
    });

    tiles.addTo(map);
    map.setView([52.51, 13.37], 13);
    map.zoomControl.setPosition('bottomright');
  }
}
