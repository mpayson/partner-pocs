# Indoor Reality POC

> Hacked POC for facility exploration in ArcGIS with Indoor Reality

Live demo: https://mpayson.github.io/indoor-reality-poc/

## Using

*Note, this has only been tested on Chrome*

#### On the Web
- Open the [demo](https://mpayson.github.io/indoor-reality-poc/) and allow [mixed content](https://stackoverflow.com/questions/18321032/how-to-get-chrome-to-allow-mixed-content). Indoor Reality viewer is loaded over `http`

#### Locally
- `git clone https://github.com/mpayson/indoor-reality-poc.git`
- Double click the `.html`!

## What We Did

1. Pulled Revit data [into ArcGIS](https://blogs.esri.com/esri/arcgis/2016/09/22/bim-gis-integration-with-ifc/) via [Pro](https://pro.arcgis.com/en/pro-app/)
2. Cleaned data and separated into [scene layers](https://pro.arcgis.com/en/pro-app/help/data/point-cloud-scene-layer/what-is-a-scene-layer-.htm)
3. [Imported OSM data](http://cehelp.esri.com/help/index.jsp?topic=/com.procedural.cityengine.help/html/manual/portal/getmapdata.html) into City Engine, [exported](http://cehelp.esri.com/help/index.jsp?topic=/com.procedural.cityengine.help/html/manual/export/export_formats_fgdb.html) to Pro, [transformed](http://pro.arcgis.com/en/pro-app/tool-reference/data-management/project.htm) to projected coordinate system, and converted to [local scene](http://pro.arcgis.com/en/pro-app/help/mapping/map-authoring/scenes.htm)
4. [Published](http://pro.arcgis.com/en/pro-app/help/sharing/overview/web-scene-layer.htm) scene layers to [ArcGIS Online](http://www.esri.com/software/arcgis/arcgisonline) and created a [Web Scene](https://doc.arcgis.com/en/arcgis-online/reference/what-is-web-scene.htm)
5. Used the [ArcGIS JS API](https://developers.arcgis.com/javascript/) to build this [POC](https://mpayson.github.io/indoor-reality-poc/)