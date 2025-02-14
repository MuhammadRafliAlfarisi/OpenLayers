import Map from "https://cdn.skypack.dev/ol/Map.js";
import View from "https://cdn.skypack.dev/ol/View.js";
import GeoJSON from 'https://cdn.skypack.dev/ol/format/GeoJSON.js';
import TileLayer from 'https://cdn.skypack.dev/ol/layer/Tile.js';
import WebGLVectorLayer from 'https://cdn.skypack.dev/ol/layer/WebGLVector.js';
import OSM from 'https://cdn.skypack.dev/ol/source/OSM.js';
import VectorSource from 'https://cdn.skypack.dev/ol/source/Vector.js';

/** @type {import('ol/style/flat.js').FlatStyleLike} */
const style = [
  {
    filter: ['==', ['var', 'highlightedId'], ['id']],
    style: {
      'stroke-color': 'white',
      'stroke-width': 3,
      'stroke-offset': -1,
      'fill-color': [255, 255, 255, 0.4],
    },
  },
  {
    else: true,
    style: {
      'stroke-color': ['*', ['get', 'COLOR'], [220, 220, 220]],
      'stroke-width': 2,
      'stroke-offset': -1,
      'fill-color': ['*', ['get', 'COLOR'], [255, 255, 255, 0.6]],
    },
  },
];

const osm = new TileLayer({
  source: new OSM(),
});

const vectorLayer = new WebGLVectorLayer({
  source: new VectorSource({
    url: 'https://openlayers.org/data/vector/ecoregions.json',
    format: new GeoJSON(),
  }),
  style,
  variables: {
    highlightedId: -1,
  },
});

const map = new Map({
  layers: [osm, vectorLayer],
  target: 'map',
  view: new View({
    center: [0, 0],
    zoom: 2,
  }),
});

let highlightedId = -1;
const displayFeatureInfo = function (pixel) {
  const feature = map.forEachFeatureAtPixel(pixel, function (feature) {
    return feature;
  });

  const info = document.getElementById('info');
  if (feature) {
    info.innerHTML = feature.get('ECO_NAME') || '&nbsp;';
  } else {
    info.innerHTML = '&nbsp;';
  }

  const id = feature ? feature.getId() : -1;
  if (id !== highlightedId) {
    highlightedId = id;
    vectorLayer.updateStyleVariables({ highlightedId });
  }
};

map.on('pointermove', function (evt) {
  if (evt.dragging) {
    return;
  }
  displayFeatureInfo(evt.pixel);
});

map.on('click', function (evt) {
  displayFeatureInfo(evt.pixel);
});
