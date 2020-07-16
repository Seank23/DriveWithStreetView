import { Component, OnInit, ViewChild } from '@angular/core';
import { GoogleMap } from '@angular/google-maps';
import { CommunicationService } from '../communication.service'
import $ from "jquery";

@Component({
  selector: 'app-location-search',
  templateUrl: './location-search.component.html',
  styleUrls: ['./location-search.component.scss']
})
export class LocationSearchComponent implements OnInit {

  @ViewChild(GoogleMap, { static: false }) map: GoogleMap

  geocoder: google.maps.Geocoder;
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
  markers = [];
  mapState = "Show";

  constructor(private comms: CommunicationService) { }

  ngOnInit() {

    this.geocoder = new google.maps.Geocoder();
    navigator.geolocation.getCurrentPosition(position => {
      this.center = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      }
      this.updateLocation(position.coords.latitude, position.coords.longitude);
      this.comms.currentCoords.subscribe(coords => this.setMapLocation(coords[0], coords[1]));
    });
  }

  click(event: google.maps.MouseEvent) {

    console.log(event);
    this.findNearestRoad(event.latLng.lat(), event.latLng.lng());
  }

  updateLocation(lat, lng) {

    this.comms.changeCoords([lat, lng]);
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

  setMapLocation(lat, lng) {

    this.map.panTo(new google.maps.LatLng(lat, lng));
    this.zoom = 14;
    this.markers.pop();
    this.markers.push({position: {lat: lat, lng: lng}});
  }

  geocodeLocation(searchTerm: string) {

    var myClass = this;
    this.geocoder.geocode({'address': searchTerm}, function(results, status) {
      if (status == 'OK') {
        console.log(results[0].geometry.location.toString());
        myClass.findNearestRoad(results[0].geometry.location.lat(), results[0].geometry.location.lng());
      } else {
        alert('Geocode was not successful for the following reason: ' + status);
      }
    });
  }

  findNearestRoad(lat, lng) {

    var myClass = this;
    $.ajax({
      url: `https://roads.googleapis.com/v1/nearestRoads?points=${lat},${lng}&key=AIzaSyBogsOu9jd3xOUwtf4MN1ic91Qg8ij5yO0`,
      success: function(result){
        console.log(result);
        myClass.updateLocation(Number(result.snappedPoints[0].location.latitude.toFixed(6)), Number(result.snappedPoints[0].location.longitude.toFixed(6)));
      }
    });
  }
}


