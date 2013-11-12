'use strict';
/*
 * Load files *locally* (GeoJSON, KML, GPX) into the map
 * using the HTML5 File API.
 *
 * Requires Pavel Shramov's GPX.js
 * https://github.com/shramov/leaflet-plugins/blob/d74d67/layer/vector/GPX.js
 */
/* global leaflet */
var L = leaflet || window.L
, FileLoader = L.Class.extend({
  includes: L.Mixin.Events,
  options: {
    layerOptions: {},
    addToMap: true
  },

  initialize: function(map, options){
    this._map = map;
    L.Util.setOptions(this, options);

    this._parsers = {
      'geojson': this._loadGeoJSON,
      'gpx': this._convertToGeoJSON,
      'kml': this._convertToGeoJSON
    };
  },

  load: function(file){
    // Check file extension
    var ext = file.name.split('.').pop(),
      parser = this._parsers[ext];
    if (!parser){
      window.alert('Unsupported file type ' + file.type + '(' + ext + ')');
      return;
    }
    // Read selected file using HTML5 File API
    var reader = new FileReader();
    reader.onload = L.Util.bind(function(e){
      this.fire('data:loading', {
        filename: file.name,
        format: ext
      });
      var layer = parser.call(this, e.target.result, ext);
      this.fire('data:loaded', {
        layer: layer,
        filename: file.name,
        format: ext
      });
    }, this);
    reader.readAsText(file);
  },

  _loadGeoJSON: function(content){
    var geojson = L.geoJson(content, this.options.layerOptions);
    if (typeof content === 'string'){
      content = JSON.parse(content);
    }
    return this.options.addToMap ? geojson.addTo(this._map) : geojson;
  },

  _convertToGeoJSON: function(content, format){
    // Format is either 'gpx' or 'kml'
    if (typeof content === 'string'){
      content = (new window.DOMParser()).parseFromString(content, 'text/xml');
    }
    var geojson = toGeoJSON[format](content);
    return this._loadGeoJSON(geojson);
  }
});

L.Control.FileLayerLoad = L.Control.extend({
  statics: {
    TITLE: 'Load local file (GPX, KML, GeoJSON)',
    LABEL: '&#8965;'
  },
  options: {
    position: 'topleft',
    fitBounds: true,
    layerOptions: {}
  },

  initialize: function(options){
    L.Util.setOptions(this, options);
    this.loader = null;
  },

  onAdd: function(map){
    this.loader = new FileLoader(map, {
      layerOptions: this.options.layerOptions
    });

    this.loader.on('data:loaded', function(e){
      // Fit bounds after loading
      if (this.options.fitBounds){
        window.setTimeout(function(){
          map.fitBounds(e.layer.getBounds()).zoomOut();
        }, 500);
      }
    }, this);

    // Initialize Drag-and-drop
    this._initDragAndDrop(map);

    // Initialize map control
    return this._initContainer();
  },

  _initDragAndDrop: function(map){
    var fileLoader = this.loader
      , dropbox = map._container
      , callbacks = {
        dragenter: function(){
          map.scrollWheelZoom.disable();
        },
        dragleave: function(){
          map.scrollWheelZoom.enable();
        },
        dragover: function(e){
          e.stopPropagation();
          e.preventDefault();
        },
        drop: function(e){
          var files = Array.prototype.slice.apply(e.dataTransfer.files)
            , loadInterval = 25

          ;(function dropLoad(){
            fileLoader.load(files.shift());
            if (files.length > 0){
              setTimeout(dropLoad, loadInterval)
            }
          })()

          e.stopPropagation();
          e.preventDefault();

          map.scrollWheelZoom.enable();
        }
      };

    for (var name in callbacks)
      dropbox.addEventListener(name, callbacks[name], false);
  },

  _initContainer: function(){
    // Create an invisible file input
    var fileLoader = this.loader
    // Create a button, and bind click on hidden file input
      , zoomName = 'leaflet-control-filelayer leaflet-control-zoom'
      , barName = 'leaflet-bar'
      , partName = barName + '-part'
      , container = L.DomUtil.create('div', zoomName + ' ' + barName)
      , fileInput = L.DomUtil.create('input', 'hidden', container)
      , link = L.DomUtil.create('a', zoomName + '-in ' + partName, container)
      , stop = L.DomEvent.stopPropagation;

    fileInput.type = 'file';
    fileInput.accept = '.gpx,.kml,.geojson';
    fileInput.style.display = 'none';
    // Load on file change
    fileInput.addEventListener('change', function(){
      fileLoader.load(this.files[0]);
    }, false);

    link.innerHTML = L.Control.FileLayerLoad.LABEL;
    link.href = '#';
    link.title = L.Control.FileLayerLoad.TITLE;

    L.DomEvent
      .on(link, 'click', stop)
      .on(link, 'mousedown', stop)
      .on(link, 'dblclick', stop)
      .on(link, 'click', L.DomEvent.preventDefault)
      .on(link, 'click', function(e){
        fileInput.click();
        e.preventDefault();
      });
    return container;
  }
});

L.Control.fileLayerLoad = function(options){
  return new L.Control.FileLayerLoad(options);
};
