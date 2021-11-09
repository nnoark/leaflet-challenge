// Define streetmap 
var streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

// Create our map
var myMap = L.map("map", {
  center: [
    37.09, -95.71
  ],
  zoom: 5,

});

streetmap.addTo(myMap);

/// define our url to get data
var url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson'

/// retrieve data and create a loop to make our markers

d3.json(url).then(function(data){
  console.log(data)
  for (var i = 0; i < data.features.length; i++) {
    latlng = [data.features[i].geometry.coordinates[1], data.features[i].geometry.coordinates[0]]
    var color = '';
    var depth = data.features[i].geometry.coordinates[2];
    switch(true){
      case (depth > -10 && depth < 10):
        color = 'rgb(19, 235, 45)'
        break;
    case (depth >= 10 && depth < 30):
        color = 'rgb(138, 206, 0)'
        break;
    case (depth >= 30 && depth < 50):
        color = 'rgb(186, 174, 0)'
        break;
    case (depth >= 50 && depth < 70):
        color = 'rgb(218, 136, 0)'
        break;
    case ( depth >= 70 && depth < 90):
        color = 'rgb(237, 91, 0)'
        break;
    case (depth >= 90):
        color = 'rgb(242, 24, 31)'
        break;
    }

    ///Variable for our popup information

    var date = data.features[i].properties.time
    var place = data.features[i].properties.place
    var magnitude = data.features[i].properties.mag

    /// Create markers and add to our map
    L.circle(latlng,{
      opacity: 0.5,
      fillOpacity: 0.75,
      weight: 0.5,
      color: 'black',
      fillColor: color,
      radius: 6000 * magnitude
    }).bindPopup(`<p align = "left"> <strong>Date:</strong> ${date} <br>
    <strong>Location:</strong> ${place} <br> <strong>Magnitude:</strong> ${magnitude} </p>`).addTo(myMap)

    newMarker = L.layer
}});

///Create our legend
var legend = L.control({position: 'bottomright'});

legend.onAdd = function (){
  var div = L.DomUtil.create('div', 'info legend');
  var grades = ['-10-10', '10-30', '30-50', '50-70', '70-90', '90+'];
  var colors = [
      'rgb(19, 235, 45)',
      'rgb(138, 206, 0)',
      'rgb(186, 174, 0)',
      'rgb(218, 136, 0)',
      'rgb(237, 91, 0)',
      'rgb(242, 24, 31)'
      ];
  var labels = [];
  grades.forEach(function(grade, index){
      labels.push("<div class = 'row'><li style=\"background-color: " + colors[index] +  "; width: 20px"+ "; height: 15px" + "\"></li>" + "<li>" + grade + "</li></div>");
  })

  div.innerHTML += "<ul>" + labels.join("") +"</ul>";
  return div;

};

legend.addTo(myMap);