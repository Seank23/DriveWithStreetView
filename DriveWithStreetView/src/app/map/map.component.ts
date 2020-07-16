import { Component, OnInit, ViewChild } from '@angular/core';
import { MapInfoWindow, GoogleMap } from '@angular/google-maps';
import { CommunicationService } from '../communication.service'
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
    minZoom: 3,
    clickableIcons: false,
    disableDefaultUI: true,
    controlSize: 25,
  }
  markers = []
  infoContent = ''
  clickedLat = 0;
  clickedLng = 0;
  mapState = "Show";

  constructor(private comms: CommunicationService) { }

  ngOnInit() {
    navigator.geolocation.getCurrentPosition(position => {
      this.center = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      }
      this.clickedLat = position.coords.latitude;
      this.clickedLng = position.coords.longitude;
    });
  }

  click(event: google.maps.MouseEvent) {

    console.log(event)
    this.clickedLat = event.latLng.lat();
    this.clickedLng = event.latLng.lng();
    this.comms.changeCoords([this.clickedLat, this.clickedLng]);
  }

  setCenter() {

    this.center.lat = this.map.getCenter().lat();
    this.center.lng = this.map.getCenter().lng();
    console.log(JSON.stringify(this.center))
  }

  showHideMap() {

    $(".map").toggleClass("expand");
    if($(".map").hasClass("expand")) {
      this.mapState = "Hide";
      $("#mapContainer").fadeIn(400);
    }
    else {
      this.mapState = "Show";
      $("#mapContainer").hide();
    }
  }
}
