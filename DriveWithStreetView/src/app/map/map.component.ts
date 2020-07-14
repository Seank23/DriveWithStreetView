import { Component, OnInit, ViewChild } from '@angular/core';
import { MapInfoWindow, MapMarker, GoogleMap } from '@angular/google-maps';
import $ from "jquery";

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  @ViewChild(GoogleMap, { static: false }) map: GoogleMap
  @ViewChild(MapInfoWindow, { static: false }) info: MapInfoWindow

  zoom = 14
  center: google.maps.LatLngLiteral
  options: google.maps.MapOptions = {
    zoomControl: true,
    scrollwheel: true,
    disableDoubleClickZoom: true,
    mapTypeId: 'hybrid',
    maxZoom: 18,
    minZoom: 8,
  }
  markers = []
  infoContent = ''
  clickedLat = 0;
  clickedLng = 0;
  streetView = new google.maps.StreetViewPanorama(document.getElementById("street-view"));

  ngOnInit() {
    navigator.geolocation.getCurrentPosition(position => {
      this.center = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      }
      this.clickedLat = position.coords.latitude;
      this.clickedLng = position.coords.latitude;
    });
    this.streetView = new google.maps.StreetViewPanorama(document.getElementById("street-view"), { position: new google.maps.LatLng(this.clickedLat, this.clickedLng) });
  }

  click(event: google.maps.MouseEvent) {

    console.log(event)
    this.clickedLat = event.latLng.lat();
    this.clickedLng = event.latLng.lng();
    this.streetView.setPosition(new google.maps.LatLng(this.clickedLat, this.clickedLng));
  }

  setCenter() {
    this.center.lat = this.map.getCenter().lat();
    this.center.lng = this.map.getCenter().lng();
    console.log(JSON.stringify(this.center))
  }

  logCenter() {
    console.log(JSON.stringify(this.map.getCenter()))
  }

  addMarker() {
    this.markers.push({
      position: {
        lat: this.clickedLat,
        lng: this.clickedLng,
      },
      label: {
        color: 'red',
        text: 'Marker label ' + (this.markers.length + 1),
      },
      title: 'Marker title ' + (this.markers.length + 1),
      info: 'Marker info ' + (this.markers.length + 1),
      options: {
        animation: google.maps.Animation.BOUNCE,
      },
    })
  }

  openInfo(marker: MapMarker, content) {
    this.infoContent = content
    this.info.open(marker)
  }
}
