//global object map
var map;
var populationLayer;
var info;
var markersCluster;
var typevalue;

//for property number of each subzone layer
var geojsonMarkerOptions = {
    radius: 9,
    weight: 1,//border width
    opacity: 1,//border transparency
    fillOpacity: 0.6,//fill transparency
	fillColor: "#67a9cf",
	color: "#0056a6",
};

//for mrt station layer
var mrtIcon = L.icon({
	iconUrl: 'img/subway.png',
    iconSize:     [10, 10], // size of the icon
})

//set colour for choropleth map
function getColor(d) {
    return d > 4486 ? '#151B54' :
           d > 2957  ? '#0041C2' :
           d > 2127 ? '#1F45FC' :
           d > 1489 ? '#357EC7' :
           d > 988  ? '#659EC7' :
           d > 577  ? '#44BBCC' :
           d > 219   ? '#88DDDD' :
                      '#BBEEFF';
}

//set style for choropleth map
function style(feature) {
					return {
						fillColor: getColor(feature.properties.density),
						weight: 2,
						opacity: 1,
						color: 'white',
						dashArray: '3',
						fillOpacity: 0.7
					};
				}
				
function onEachFeature(feature,layer) {
	layer.on({
		mouseover: highlightFeature,
		mouseout: resetHighlight,
		click: zoomToFeature
	});
}
				
//when mouse hover on
function highlightFeature(e) {
	var layer = e.target;

	layer.setStyle({
		weight: 5,
		color: '#666',
		dashArray: '',
		fillOpacity: 0.7
	});

//bring the layer into top layer
	if (!L.Browser.ie && !L.Browser.opera) {
		layer.bringToFront();
	}
	
	info.update(layer.feature.properties);
}

//resetStyle will set the style to original state
function resetHighlight(e) {
	censusLayer.resetStyle(e.target);
	info.update();
}

//zoom in to the feature when clicked
function zoomToFeature(e) {
	map.fitBounds(e.target.getBounds());
}
				
//initialize the map by setMap()
function initialize(){			
setMap();
}

//define setMap, it is the primary function 
function setMap(){
	var osmLink = '<a href="http://openstreetmap.org">OpenStreetMap</a>',
		thunLink = '<a href="http://thunderforest.com/">Thunderforest</a>';
					
	var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
		osmAttrib = '&copy; '+ osmLink + 'Contributors',
		landUrl = 'http://{s}.tile.opencyclemap.org/transport/{z}/{x}/{y}.png'
		thunAttrib = '&copy;' + osmLink + ' Contributors &' + thunLink;
		
	var osmMap = L.tileLayer(osmUrl,{attribution:osmAttrib}),
		transportMap = L.tileLayer(landUrl,{attribution:thunAttrib});
	
	//define the map object
	map = L.map('map',{
					layers: osmMap //set initial layer when window is loaded
				})
				.setView([1.355312,103.827068], 12);
	
	//the base layer 
	var baseLayers = {
					"OSM Map": osmMap,
					"Transport Map": transportMap
					}
	
	
	//add content to the choropleth map layer
	censusLayer = L.geoJson(census, {
					style: style,
					onEachFeature: onEachFeature
				});
	
	//create the info control object for displaying information	
	info = L.control({position:"bottomleft"});

	info.onAdd = function () {
		this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
		this.update();
		return this._div;
	};

	// method that we will use to update the control based on feature properties passed
	info.update = function (props) {
		this._div.innerHTML = '<h4>Total density</h4>' +  (props ?
			'<b>' + props.DGPSZ_NAME + '</b><br />' + props.density + ' people/100m'+'<sup>2<sup>'
			: 'Hover over a zone');
	};
	
	var trailLayer = new L.LayerGroup().addTo(map);
	
	MRTLayer = L.geoJson(trail,{style:{color:'red'}}).addTo(trailLayer);
	mrtStationLayer = L.geoJson(mrtStation, {
        pointToLayer: function (feature, latlng) {
            return L.marker(latlng, {icon: mrtIcon});
        }
}).addTo(trailLayer);
	
	var propertytLayer1 = new L.LayerGroup();
	
	property1 = L.geoJson(propertysubzonedata,{
		pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, geojsonMarkerOptions).setRadius(1.2*Math.sqrt(feature.properties.PNTCNT));
		}
	});

	
	    markersCluster = L.markerClusterGroup().addTo(map);
	
	    $.getJSON('data/askpricefinal2.geojson', function(data) {

	    	console.log(data);
        
        
         // markerCluster.setMap(null);

        jsonArray = data;
        
        sliderRange();
        sliderSize();
		//addMarkerCluster(jsonArray.features);

        $(".selector1").slider({ change: functionFilter
});
        $( ".selector2" ).slider({ change: functionFilter
});
         $(".selector3").change(functionFilter);
   function functionFilter() {
        // map.removeLayer(markersCluster)
        typevalue = $( "#Type option:selected" ).text();
        //console.log(typevalue);

        // var askingprice = [];
        // for(i = 0; i < jsonArray.features.length; i++){
        // 	askingnumber = Number($(jsonArray.features).properties.asking.replace(/[^0-9\.]+/g,""));
        // 	askingprice.push(askingnumber);

        // }
        // var maxprice = Math.max.apply(Math, askingprice);
        // var minprice = Math.max.apply(Math, askingprice);
        // console.log(maxprice);

        asking_min = $( "#slider-range" ).slider( "values", 0 )*1000;
        asking_max = $( "#slider-range" ).slider( "values", 1 )*1000;
        size_min = $( "#slider-size" ).slider( "values", 0 );
        size_max = $( "#slider-size" ).slider( "values", 1 );

        console.log(asking_max);
        // if(typevalue == "All Types"){
        // 	addMarkerCluster(jsonArray);
        // }
        // else{
        var dataK = $(jsonArray.features).filter(selectType);

        

        var newdata = 
        {
           "type": "FeatureCollection",
           "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },                                                                                
           "features": dataK
       }

        addMarkerCluster(newdata);
        // $('.leaflet-control-layers-selector')[5].click()

    

}     
        
      

    });

markersCluster.on('click', function (a) {
    var clickprice = +a.layer.feature.properties.psf.replace(/[^0-9\.]+/g,"");
    var clickregion = a.layer.feature.properties["planning area"];
    var clicktype = a.layer.feature.properties.type;

    console.log(clickprice,clickregion,clicktype);

    displayChart(clickprice,clickregion,clicktype);
});


function selectType(i,n){
	  //console.log(typeof(+n.properties.asking.replace(/[^0-9\.]+/g,"")));
        var filtervalue = (n.properties.type==typevalue && 
        +n.properties.asking.replace(/[^0-9\.]+/g,"")<=asking_max && 
        +n.properties.asking.replace(/[^0-9\.]+/g,"")>=asking_min&& 
        parseInt(n.properties.area.split(' ')[0].replace(/,/g, ''), 10)<=size_max && 
        parseInt(n.properties.area.split(' ')[0].replace(/,/g, ''), 10)>=size_min);


        return filtervalue;

    }

// function selectType(i,n){
//         	// console.log(n.properties.type);
//         return n.properties.asking===askingvalue;
//     }

// function selectType(i,n){
//         	// console.log(n.properties.type);
//         return n.properties.area===sizevalue;
//     }

//Information Control for dynamic tooltipping
function propertyInfo(property) {
    return  'Project: ' + property["name"] + '<br>' +
            'Type: ' + property["type"] + '<br>' +
            'Address: ' + property["address"] + '<br>'+
            'Asking Price: '+property["asking"]+'<br>'+
            'PSF: '+property['psf'];
            console.log("here");
}	
	
function addMarkerCluster(json) {
    var geoJsonLayer = new L.geoJson(json,{
		onEachFeature: function(feature, layer) {
            layer.bindPopup(propertyInfo(feature.properties));
        }
	});
	//remove the previous added layers
	markersCluster.clearLayers();
    markersCluster.addLayer(geoJsonLayer);
}	
	

	
	var overlays = {
		"Population Density":censusLayer,
		"MRT Layer":trailLayer,
		"Counts in Planning Area":property1,
		'Cluster Marker': markersCluster
		}
		
	L.control.layers(baseLayers,overlays,{collapsed:false}).addTo(map);
	
	var legend = L.control({position: 'bottomright'});
	
	legend.onAdd = function (map) {

	var div = L.DomUtil.create('div', 'info legend'),
		grades = [0, 220, 580, 990, 1500, 2130, 2960, 4490],
		labels = [];

	// loop through our density intervals and generate a label with a colored square for each interval
	for ( i = 0; i < grades.length; i++) {
		div.innerHTML +=
			'<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
			grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
	}

	return div;
	};
				
						
	// toggle on legend, info and region layer
	map.on('overlayadd', function (eventLayer) {

	
    // Switch to the chloropleth legend...
		if (eventLayer.name === "Population Density") {
			
			legend.addTo(this);
			info.addTo(this);
		}
		
		else { // Or switch to the Population Change legend...
			
		}
	});
	
	//toggle off legend and region layer
	map.on('overlayremove', function (eventLayer) {
	
    // Switch to the chloropleth legend...
		if (eventLayer.name === "Population Density") {
			
			
			this.removeControl(legend);
			this.removeControl(info);
				
		}
		
		else { // Or switch to the Population Change legend...
			
		}
	});

}



//when window is loaded
window.onload = initialize();