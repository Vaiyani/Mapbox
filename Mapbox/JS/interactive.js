mapboxgl.accessToken = 'pk.eyJ1IjoidmFpeWFuaSIsImEiOiJjajl0aHhrMHMxMGdiMzFwb2ZrOWlnNm13In0.A3MK33A0biD3PlSVe-3H8Q'; 
var map = new mapboxgl.Map({
  container: 'map',
  //style: 'mapbox://styles/vaiyani/cjbnk6yuo53so2qtg6lkozady',
  style: 'mapbox://styles/vaiyani/cjcka9gjj9x2g2rqiy4qtdify',
  doubleClickZoom: false,
  pitch: 60,
});
var popup = new mapboxgl.Popup({
    closeButton: true,
    closeOnClick: false
});

map.fitBounds([[59.3, 30.3753], [79.3, 30.3753]]);
map.addControl(new mapboxgl.NavigationControl(),'top-left');

map.on('load', function() {
    var source = "Yearly"
    map.addSource("Yearly",{
      type: "geojson",
      data: "JSON/result.json"
    });

    addCustomlayer(map,"Polygons",source,0.4);
    addCustomlayer(map,"Polygons copy",source,0.8);    
    //addbuildings(map);

    
    map.setLayoutProperty('Polygons copy', 'visibility', 'none');


    var layers = ['0-10000', '10K-100K','100K-1M', '1M+'];
    var colors = ['#FFEDA0', '#FEB24C','#FC4E2A', '#BD0026'];
  
    var filterInput = document.getElementById('filter-input');
    for (i = 0; i < layers.length; i++) {
      var layer = layers[i];
      var color = colors[i];
      var item = document.createElement('div');
      var key = document.createElement('span');
      key.className = 'legend-key';
      key.style.backgroundColor = color;

      var value = document.createElement('span');
      value.innerHTML = layer;
      item.appendChild(key);
      item.appendChild(value);
      legend.appendChild(item);
    }

    map.on('click', 'Polygons', function (e) {
        var selected = [];
        var Listings = [];
        var NumClient = [];
        var QuotaUtilize = [];

        Listings = sumArray(Listings,JSON.parse(e.features[0].properties["data"]).ActiveListings);
        NumClient = sumArray(NumClient,JSON.parse(e.features[0].properties["data"]).NumClient);
        QuotaUtilize = sumArray(QuotaUtilize,JSON.parse(e.features[0].properties["data"]).QuotaUtilize);
        
        
        popup.remove();
        map.getCanvas().style.cursor = 'pointer';
        popup.setLngLat(e.lngLat)
             .setHTML('<p>' + 'Polygon ID  '  + '<strong>' + e.features[0].properties.Polygon_ID + '</strong> </p>'
                    + '<p>' + 'Area Id  '  + '<strong>' + e.features[0].properties.Area_ID + '</strong> </p>'
                    + '<p>' + 'Area Name  '  + '<strong>' + e.features[0].properties.Area_Name+ '</strong> </p>'
                    + '<p>' + 'Listings  '  + '<strong>' + Listings.join(', ') + '</strong> </p>'
                    + '<p>' + 'Num of clients  '  + '<strong>' + NumClient.join(', ') + '</strong> </p>'
                    + '<p>' + 'Quota Utilize  '  + '<strong>' + QuotaUtilize.map(function(x) {return ((x * 100).toFixed(2) + '%');}).join(', ') + '</strong> </p>')
            .addTo(map);
            map.setFilter('Polygons copy', ['==', 'Polygon_ID', e.features[0].properties.Polygon_ID]);
            map.setLayoutProperty('Polygons copy', 'visibility', 'visible');
    });

    popup.on('close', function(){
        map.setFilter('Polygons copy', ['>', 'Polygon_ID', '']);
        map.setLayoutProperty('Polygons copy', 'visibility', 'none');
        map.getCanvas().style.cursor = '';
    });
    
    
    map.on('click',function(e){
      var l1 = map.unproject(e.point).toBounds(100).toArray()
      map.fitBounds(l1,{
        maxZoom: 13
      });
    });
          
});


function addCustomlayer(map,name,source,opacity){
    map.addLayer({
        "id": name,
        "type": "fill",
        "source": source,
        "paint": {
          "fill-color": {
            property :'TotalActiveListings',
            stops: [  [0, '#FFEDA0'],
                      [10000, '#FEB24C'],
                      [100000, '#FC4E2A'],	
                      [1000000, '#BD0026'] ],
            type: 'interval'          	
          },
          "fill-opacity": opacity,
          "fill-outline-color" : "#000000"
        }        
    },"admin-3-4-boundaries-bg");
}

function addbuildings(map){
    var layers_map = map.getStyle().layers;
    var labelLayerId;
    for (var i = 0; i < layers_map.length; i++) {
        if (layers_map[i].type === 'symbol' && layers_map[i].layout['text-field']) {
            labelLayerId = layers_map[i].id;
            break;
        }
    }
    map.addLayer({
        'id': '3d-buildings',
        'source': 'composite',
        'source-layer': 'building',
        'filter': ['==', 'extrude', 'true'],
        'type': 'fill-extrusion',
        'minzoom': 15,
        'paint': {
            'fill-extrusion-height': [
                "interpolate", ["linear"], ["zoom"],
                15, 0,
                15.05, ["get", "height"]
            ],
            'fill-extrusion-base': [
                "interpolate", ["linear"], ["zoom"],
                15, 0,
                15.05, ["get", "min_height"]
            ],
            'fill-extrusion-color': '#AAAAAA'           
        }
    }, labelLayerId);
}


function callbackFunc(response) {
    // do something with the response
    console.log(response);
}

function sumArray(a, b) {
      var c = [];
      for (var i = 0; i < Math.max(a.length, b.length); i++) {
        c.push((a[i] || 0) + (b[i] || 0));
      }
      return c;
}
function changedata(Month){
	var s = Month + ".json"
	map.getSource('Yearly').setData(s);
}

function FilterPolygon(){
  var x = document.getElementById("filter-input");
  var value = parseInt(x.value);
      if(value>0){
        map.setFilter('Polygons', ['>', 'TotalActiveListings', value]);
      } else{
        console.log(value)
        map.setFilter('Polygons', ['>', 'TotalActiveListings', 0]);
      }

}

function bound(clicked_id){
  if(clicked_id == "Karachi"){
      map.fitBounds([[
          67.0052035147045,          
          24.800662120009974
      ],
      [
          67.19150283314139,
          24.934675076621176
      ]]);
  } else if(clicked_id == "Islamabad"){
      map.fitBounds([[
          72.62768337081113,
          33.38945055247545
      ],
      [
          73.63007949398019,          
          33.794110568007724
      ]]);
  } else if(clicked_id == "Lahore"){

      map.fitBounds([[
          74.24667959107714,
          31.444961934002578
      ],
      [
          74.45847397935196,
          31.581101068071064
      ]]);      
  }
}

function w3_open() {
      document.getElementById("main").style.marginLeft = "25%";
      document.getElementById("mySidebar").style.width = "25%";
      document.getElementById("mySidebar").style.display = "block";
      document.getElementById("openNav").style.display = 'none';
    }
function w3_close() {
  document.getElementById("main").style.marginLeft = "0%";
  document.getElementById("mySidebar").style.display = "none";
  document.getElementById("openNav").style.display = "inline-block";
}
