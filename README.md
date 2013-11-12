Leaflet.FileLayer
=================

Loads local files (GeoJSON, GPX, KML) into the map using the [HTML5 FileReader API](http://caniuse.com/filereader), **without server call** !

* A simple map control
* The user can browse a file locally
* It is read locally (``FileReader``) and converted to GeoJSON
* And loaded as a layer eventually!

Check out the [demo](http://makinacorpus.github.com/Leaflet.FileLayer/) !

For GPX and KML files, it currently depends on [Tom MacWright's togeojson.js](https://github.com/tmcw/togeojson).

## Usage

```js
    var map = L.map('map').fitWorld();

    L.Control.fileLayerLoad({
        layerOptions: {
          // http://leafletjs.com/reference.html#geojson-options
        }
        , addToMap: true // after loading the GeoJSON, should it be added to the map?
        , position: 'topleft'
    }).addTo(map);
```

### Events

```js
    var control = L.Control.fileLayerLoad();

    control.loader.on('data:loaded', function (e) {
        // Add to map layer switcher
        layerswitcher.addOverlay(e.layer, e.filename);
    });
```

### Config

#### Button
`L.Control.FileLayerLoad.title` The `title` attr given to the upload button.
`L.Control.FileLayerLoad.label` The text of the upload button.
`L.Control.FileLayerLoad.className` The `class` name of the container of the upload button.
`L.Control.FileLayerLoad.barName` The `class` name of the immediate child of the container
`L.Control.FileLayerLoad.barPartName` The `class` name of the actual button

Generated HTML for the button
```html
<div class="L.Control.FileLayerLoad.className leaflet-control">
  <div class="L.Control.FileLayerLoad.barName">
    <a class="L.Control.FileLayerLoad.className L.Control.FileLayerLoad.barPartName" href="#" title="L.Control.FileLayerLoad.title">L.Control.FileLayerLoad.label</a>
  </div>
</div>
```


## Changelog

### 0.2.4
* Expose class names for user configuration

### 0.2.3
* Added `addToMap` option

### 0.2.0
* Converted to a UMD module
* added grunt deploy process
* Now, also a bower module

### 0.1.0
Initial


## Authors

[![Makina Corpus](http://depot.makina-corpus.org/public/logo.gif)](http://makinacorpus.com)

[Joey Baker](http://byjoeybaker.com)
