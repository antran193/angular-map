import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataServiceService } from '../service/data-service.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { isNgTemplate } from '@angular/compiler';

declare let L: any;
// export interface poly {
//   type?: string,
//   id?: number,
//   properties?: {
//     name?: string,
//     density?: number,
//     geometry?: {
//       type?: string,
//       coordinates?: string,
//     }
//   }
// }
var LeafIcon = L.Icon.extend({
  options: {
    shadowUrl: '',
    iconSize: [38, 40],
    iconAnchor: [22, 40],
    popupAnchor: [-3, -40],
  }
});
var cu = new LeafIcon({ iconUrl: '../../assets/cu.svg' }),
  trau = new LeafIcon({ iconUrl: '../../assets/trau.svg' }),
  cau = new LeafIcon({ iconUrl: '../../assets/cau.svg' });

var geojsonFeature = {
  "type": "Feature",
  "properties": {
    "name": "Coors Field",
    "amenity": "Baseball Stadium",
    "popupContent": "This is where the Rockies play!"
  },
  "geometry": {
    "type": "Point",
    "coordinates": [-0.08754, 51.4966]
  }
};
var myLines = [{
  "type": "LineString",
  "coordinates": [[-100, 40], [-105, 45], [-110, 55]]
}, {
  "type": "LineString",
  "coordinates": [[-105, 40], [-110, 45], [-115, 55]]
}];
var myStyle = {
  "color": "#ff7800",
  "weight": 5,
  "opacity": 0.65
};

var states = [{
  "type": "Feature",
  "properties": { "party": "Republican" },
  "geometry": {
    "type": "Polygon",
    "coordinates": [[
      [-104.05, 48.99],
      [-97.22, 48.98],
      [-96.58, 45.94],
      [-104.03, 45.94],
      [-104.05, 48.99]
    ]]
  }
}, {
  "type": "Feature",
  "properties": { "party": "Democrat" },
  "geometry": {
    "type": "Polygon",
    "coordinates": [[
      [-109.05, 41.00],
      [-102.06, 40.99],
      [-102.03, 36.99],
      [-109.04, 36.99],
      [-109.05, 41.00]
    ]]
  }
}];
var geojsonMarkerOptions = {
  radius: 8,
  fillColor: "#ff7800",
  color: "#000",
  weight: 1,
  opacity: 1,
  fillOpacity: 0.8
};
var someFeatures = [{
  "type": "Feature",
  "properties": {
    "name": "Coors Field",
    "show_on_map": true
  },
  "geometry": {
    "type": "Point",
    "coordinates": [-104.99404, 39.75621]
  }
}, {
  "type": "Feature",
  "properties": {
    "name": "Busch Field",
    "show_on_map": false
  },
  "geometry": {
    "type": "Point",
    "coordinates": [-104.98404, 39.74621]
  }
}];
var littleton = L.marker([39.61, -105.02]).bindPopup('This is Littleton, CO.'),
  denver = L.marker([39.74, -104.99]).bindPopup('This is Denver, CO.'),
  aurora = L.marker([39.73, -104.8]).bindPopup('This is Aurora, CO.'),
  golden = L.marker([39.77, -105.23]).bindPopup('This is Golden, CO.');
var cities = L.layerGroup([littleton, denver, aurora, golden]);
var grayscale = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1Ijoic29uYW4xMjAzOTMiLCJhIjoiY2p1M3A4aGdlMHBuOTQ0b2JjdHN3cTlsMCJ9.3t-eawzOhtV7CsIwQbbrxA', {
  id: 'mapbox/streets-v11', tileSize: 512, zoomOffset: -1, attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  maxZoom: 18,
  accessToken: 'pk.eyJ1Ijoic29uYW4xMjAzOTMiLCJhIjoiY2p1M3A4aGdlMHBuOTQ0b2JjdHN3cTlsMCJ9.3t-eawzOhtV7CsIwQbbrxA'
});
var mqi = L.tileLayer("http://mt0.google.com/vt/lyrs=y&hl=en&x={x}&y={y}&z={z}");



@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],

})
export class MapComponent implements OnInit {
  mymap: any;
  iscall: boolean = false;
  hanhchinh: any;
  control: any;
  cityPoly: any;

  base = [{
    name: 'open street map',
    checked: false,
    styMap: grayscale
  }, {
    name: 'gg set',
    checked: false,
    styMap: mqi
  },
  ];

  constructor(private getData: DataServiceService) { }

  ngOnInit(): void {
    this.loadMap();
    this.addMaker();
    this.addPolygon();
    this.addCircle();
    // this.addPopup();
    this.loadGeoLine();
    this.loadGeoPoly();
    this.loadGeoPoint();
    this.loadGeoInvi();
    this.loadPolyGeoJson();


    var app = this;
    this.mymap.on('click', function (e: any) {
      app.onMapClick(e);
    })
  }
  eventCheck(e: any, item: any) {
    if (e.target.checked === true) {
      item.styMap.addTo(this.mymap);
    }
    else {
      item.styMap.remove()
    }
  }

  // enter() {
  //   this.iscall = true;
  //   console.log(this.iscall);
  // }
  // out() {
  //   this.iscall = false;
  //   console.log(this.iscall);
  // }

  loadPolyGeoJson() {

    this.getData.getData().subscribe(res => {
      this.hanhchinh = res;
      var c = L.layerGroup();
      for (let i = 0; i < this.hanhchinh.length; i++) {
        var styles = this.style(this.hanhchinh[i]);
        var b = L.geoJSON(this.hanhchinh[i], { style: styles }).on('mouseover', function (e: any) {
          let a = e.target;
          a.setStyle({
            fillColor: 'red',
            weight: 2,
            opacity: 1,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.7
          })
        }).on('mouseout', function (e: any) {
          let a = e.target;
          a.resetStyle();
        });
        c.addLayer(b);
      }
      var newlayer = {
        name: 'City',
        checked: false,
        styMap: c
      };
      this.base.push(newlayer);
    })
  }
  loadGeoInvi() {
    L.geoJSON(someFeatures, {
      filter: function (feature: any, layer: any) {
        return feature.properties.show_on_map;
      }
    }).addTo(this.mymap);
  }
  loadGeoLine() {
    L.geoJSON(myLines, {
      style: myStyle
    }).addTo(this.mymap);
  }
  loadGeoPoint() {
    L.geoJSON(geojsonFeature, {
      onEachFeature: this.onEachFeature
    }).addTo(this.mymap);
  }
  onEachFeature(feature: any, layer: any) {
    // does this feature have a property named popupContent?
    if (feature.properties && feature.properties.popupContent) {
      layer.bindPopup(feature.properties.popupContent);
    }
  }
  // code is ok. load geojson maker
  // loadGeoPoint() {
  //   L.geoJSON(geojsonFeature, {
  //     pointToLayer: function (feature:any, latlng:any) {
  //         return L.circleMarker(latlng, geojsonMarkerOptions);
  //     }
  // }).addTo(this.mymap);
  // }
  loadGeoPoly() {
    L.geoJSON(this.hanhchinh, {
      style: function (feature: any) {
        switch (feature.properties.party) {
          case 'Republican': return { color: "#ff0000" };
          case 'Democrat': return { color: "#0000ff" };
          default: return { color: "#0000ff" };
        }
      }
    }).addTo(this.mymap);
  }
  loadMap() {
    this.mymap = L.map('mapid', {
      zoomSnap: 0.25,
      center: [39.73, -104.99],
      zoom: 10,
    }).setView([51.505, -0.09], 13);
    // L.control.layers(baseMaps, overlayMaps).addTo(this.mymap);
    // this.controlMap();
  }

  addMaker() {
    var app = this;

    var marker = L.marker([51.5, -0.09], { draggable: 'true', icon: cau }).addTo(this.mymap);
    marker.bindPopup("<b>Hello An Cho Dien</b><br>").openPopup();
    marker.on('dragend', function (e: any) {
      var marker = e.target;
      var position = marker.getLatLng();
      // marker.setLatLng(new L.LatLng(position.lat, position.lng), { draggable: 'true' });
      marker._popup.setContent("<b>Hello An Cho Dien</b><br>" + `${(position.lat)}` + ", " + `${(position.lng)}`)
    }).bindPopup(`<b>Hello An Cho Dien</b><br>`).openPopup()
  }
  addCircle() {
    var circle = L.circle([51.508, -0.11], {
      color: 'red',
      fillColor: '#f03',
      fillOpacity: 0.5,
      radius: 500
    }).addTo(this.mymap);
    circle.bindPopup("<h1>Yo hellooooo!!! </h1>");
  }
  addPolygon() {
    var polygon = L.polygon([
      [51.509, -0.08],
      [51.503, -0.06],
      [51.51, -0.047]
    ]).addTo(this.mymap);
    polygon.bindPopup("<h2>Tam Mat Day</h2>");
  }
  addPopup() {
    var popup = L.popup()
      .setLatLng([51.5, -0.08])
      .setContent("I am a standalone popup.")
      .openOn(this.mymap);
  }
  onMapClick(e: any) {
    var lat = e.latlng.lat;
    var lng = e.latlng.lng;
    var popup = L.popup();
    popup
      .setLatLng([lat, lng])
      .setContent("You clicked the map at " + lat + " " + lng)
      .openOn(this.mymap);
  }
  Color(d: any) {
    var color = "";
    d > 1000 ? color = '#800026' :
      d > 500 ? color = '#BD0026' :
        d > 200 ? color = '#E31A1C' :
          d > 100 ? color = '#FC4E2A' :
            d > 50 ? color = '#FD8D3C' :
              d > 20 ? color = '#FEB24C' :
                d > 10 ? color = '#FED976' :
                  color = '#FFEDA0';
    return color;
  }
  style(feature: any) {
    let a = this.Color(feature.properties.density);
    return {
      fillColor: a,
      weight: 2,
      opacity: 1,
      color: 'white',
      dashArray: '3',
      fillOpacity: 0.7
    };
  }
}
// function layer(layer: any) {
//   throw new Error('Function not implemented.');
// }

