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
        , fileSize: 1024 // 1024kb by default. Pass any integer to set the kb file size limit.
    }).addTo(map);
```

### Events

```js
    var control = L.Control.fileLayerLoad();

    control.loader.on('data:loaded', function (e) {
        // Add to map layer switcher
        layerswitcher.addOverlay(e.layer, e.filename);
    });

    control.loader.on('data:loading', function(e){
      console.log(e.filename, e.ext)
    })

    control.loader.on('data:error', function(e){
      console.log(e.error, e.message)
    })
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
    <a class="L.Control.FileLayerLoad.barPartName" href="#" title="L.Control.FileLayerLoad.title">L.Control.FileLayerLoad.label</a>
  </div>
</div>
```

#### DOM elements
```js
    var control = L.Control.fileLayerLoad();

    control.button // the DOM element for the upload button
    control.fileInput // the DOM element for the hidden file input
    control.onClick // the function that's called when the user clicks on the button. This is useful if you want to override the default behavior

    // example of overriding the default button behavior
    L.DomEvent.removeListener(control.button, 'click', control.onclick)

    $(control.button).on('click', function(){
      console.log('The user clicked the upload button!')
    })
```

## Changelog

### 0.2.7
* Trigger an error event if the parsed GeoJSON has no layers. This could be caused by a filter function.

### 0.2.6
* Added `fileSize` option to limit the size of uploaded files.

### 0.2.5
* throw an error event when the uploaded file fails to parse
* only fire the `data:loaded` event when the data is successfully parses.
* remove the `className` from the `barName` element.

### 0.2.4
* Expose class names for user configuration
* Allow the user to upload the same file twice in a row
* Expose DOM elements and events so that the default button click behavior can be overridden.

### 0.2.3
* Added `addToMap` option, to make adding the resulting geojson to the map optional. This is useful if you want to control which layer the geojson is added to.

### 0.2.0
* Converted to a UMD module
* added grunt deploy process
* Now, also a bower module

### 0.1.0
Initial

## Developing
* The `dist` folder is auto-generated when running `grunt publish`
* Please update the Changelog in the readme for each release.

## Authors

[![Makina Corpus](http://depot.makina-corpus.org/public/logo.gif)](http://makinacorpus.com)

[Joey Baker](http://byjoeybaker.com)
