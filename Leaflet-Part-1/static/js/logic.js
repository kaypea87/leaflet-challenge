// Creating our initial map object:
// We set the longitude, latitude, and starting zoom level.
// This gets inserted into the div with an id of "map".
let myMap = L.map("map", {
    center: [40.52, -74.67],
    zoom: 3
});

// Adding a tile layer (the background map image) to our map:
// We use the addTo() method to add objects to our map.
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

//using USGS GeoJSON "All earthquakes from the past 7 days"
queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Perform a GET request to the query URL/
d3.json(queryUrl).then(function (data) {
    // Once we get a response, send the data to the run through switch.
    console.log(data);
    function chooseColor(x) {
        switch (true) {
            case x > 90:
                return "red";
            case x > 70:
                return "orangered";
            case x > 50:
                return "orange";
            case x > 30:
                return "yellow";
            case x > 10:
                return "yellowgreen";

            default:
                return "green";
        }
    }
    //circle marker on the graph
    L.geoJson(data, {
        pointToLayer: function (feature, latlong) {
            return L.circleMarker(latlong);
        },
        style: function (feature) {
            return {
                fillColor: chooseColor(feature.geometry.coordinates[2]),
                radius: feature.properties.mag * 3,
                weight: 0.25,
                fillOpacity: 0.9
            }

        },
     // Giving each feature a popup with information that's relevant to it
     onEachFeature: function (feature, layer) {
        layer.bindPopup("<h1>" + "Mag: "+ feature.properties.mag + "</h1> <hr> <h2>" + "Location: "+ feature.properties.place + "</h2>");
    }
}).addTo(myMap);
//legend

var legend = L.control({ position: "bottomright" });

legend.onAdd = function(map) {
  var div = L.DomUtil.create("div", "legend");
  div.innerHTML += "<h4>Legend</h4>";
  div.innerHTML += '<i style="background: #00FF00"></i><span>-10-10</span><br>';
  div.innerHTML += '<i style="background: #9acd32"></i><span>10-30</span><br>';
  div.innerHTML += '<i style="background: #FFFF00"></i><span>30-50</span><br>';
  div.innerHTML += '<i style="background: #FFA500"></i><span>50-70</span><br>';
  div.innerHTML += '<i style="background: #FF4500"></i><span>70-90</span><br>';
  div.innerHTML += '<i style="background: ##FF0000"></i><span>90+</span><br>';

  return div;
};

legend.addTo(myMap);

});