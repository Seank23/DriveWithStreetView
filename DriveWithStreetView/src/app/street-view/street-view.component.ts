import { Component, OnInit } from '@angular/core';
import { CommunicationService } from '../communication.service'
import { HttpService } from '../http.service';

@Component({
  selector: 'app-street-view',
  templateUrl: './street-view.component.html',
  styleUrls: ['./street-view.component.scss']
})
export class StreetViewComponent implements OnInit {

  streetView: google.maps.StreetViewPanorama;

  constructor(private comms: CommunicationService, private http: HttpService) { }

  ngOnInit() {
    this.streetView = new google.maps.StreetViewPanorama(document.getElementById("street-view"));
    this.comms.currentCoords.subscribe(coords => this.setStreetViewLocation(coords[0], coords[1]));
    navigator.geolocation.getCurrentPosition(position => {
      this.setStreetViewLocation(position.coords.latitude, position.coords.longitude);
    });
  }

  setStreetViewLocation(lat, lng) {

    this.http.getPanoramaId(lat, lng).subscribe(result => {
      console.log(result);
      this.updateStreetView(result['pano_id']);
    });
  }

  updateStreetView(panoramaId) {

    var myClass = this;
    var prevHeading = this.streetView.getPov().heading;
    this.streetView.setPano(panoramaId);

    setTimeout(function() {
      var links = myClass.streetView.getLinks();
      var nextHeading = links[0].heading;

      for(var i = 1; i < links.length; i++) {
        if(Math.min((links[i].heading - prevHeading + 360) % 360, (prevHeading - links[i].heading + 360) % 360) < Math.min((nextHeading - prevHeading + 360) % 360, (prevHeading - nextHeading + 360) % 360))
          nextHeading = links[i].heading;
      }
      myClass.streetView.setPov({heading: nextHeading, pitch: 0});
    }, 200);

  }
}
