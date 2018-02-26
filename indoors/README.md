# Indoo.rs POC
Indoors UC 17 demo... client coming soon

## Resources
### Streaming Services
Input:
*  http://startupsges.bd.esri.com:6180/geoevent/rest/receiver/indoors-features-in-rest

Output:
* Stream Service: https://startupsges.bd.esri.com/server/rest/services/IndoorsPOCStream/StreamServer
* Historical Feature Service: https://services.arcgis.com/q7zPNeKmTWeh7Aor/arcgis/rest/services/indoors_history/FeatureServer

### Content Services
* Building: https://services.arcgis.com/q7zPNeKmTWeh7Aor/arcgis/rest/services/SDCC_Buildings/FeatureServer
* Rooms: https://services.arcgis.com/q7zPNeKmTWeh7Aor/arcgis/rest/services/SDCC_RoomUnits/FeatureServer
* Building Details: https://services.arcgis.com/q7zPNeKmTWeh7Aor/arcgis/rest/services/SDCC_BuildingDetails/FeatureServer
* Points of Interest: https://services.arcgis.com/q7zPNeKmTWeh7Aor/arcgis/rest/services/SDCC_PointsOfInterest/FeatureServer

Viewer:
* https://startups.maps.arcgis.com/apps/webappviewer/index.html?id=6fe5a75c7c2846c88896d17318067b6e

## Development Notes
Expected input format (JSON post):
```
{
  "attributes": {
    "deviceId": <string>,
    "buildingId": <long>,
    "lat": <double>,
    "lon": <double>,
    "z": <double>,
    "buildingX":<double>,
    "buildingY":<double>,
    "buildingZ":<double>,
    "other": <string>,
    "timerecordstamp": <date utc iso 8601>
  },
  "geometry": {
      "x": <LON || double>,
      "y": <LAT || double>,
      "z": <meters || double>
  }
}
```
