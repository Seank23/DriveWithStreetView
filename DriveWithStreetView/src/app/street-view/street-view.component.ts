import { Component, OnInit } from '@angular/core';
import { CommunicationService } from '../communication.service'

@Component({
  selector: 'app-street-view',
  templateUrl: './street-view.component.html',
  styleUrls: ['./street-view.component.scss']
})
export class StreetViewComponent implements OnInit {

  streetView: google.maps.StreetViewPanorama;

  constructor(private comms: CommunicationService) { }

  ngOnInit() {
    this.streetView = new google.maps.StreetViewPanorama(document.getElementById("street-view"));
    this.comms.currentCoords.subscribe(coords => this.updateStreetView(coords));
    navigator.geolocation.getCurrentPosition(position => {
      this.updateStreetView([position.coords.latitude, position.coords.longitude]);
    });
  }

  updateStreetView(coords: number[]) {
    this.streetView.setPosition(new google.maps.LatLng(coords[0], coords[1]));
  }
}
