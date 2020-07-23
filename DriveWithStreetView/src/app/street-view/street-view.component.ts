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
  streetViewLookAhead: google.maps.StreetViewService;
  steps: number = 1;

  constructor(private comms: CommunicationService, private http: HttpService) { }

  ngOnInit() {

    this.streetView = new google.maps.StreetViewPanorama(document.getElementById("street-view"));
    this.streetViewLookAhead = new google.maps.StreetViewService();

    this.comms.currentCoords.subscribe(coords => this.setStreetViewLocation(coords[0], coords[1]));
    this.comms.currentSteps.subscribe(stepValue => this.steps = stepValue);

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
    this.streetView.setPano(panoramaId);

    setTimeout(function() {
      myClass.getNextLink(panoramaId, myClass.streetView.getPov().heading, function(link) {
        myClass.streetView.setPov({heading: link.heading, pitch: 0});
      });
    }, 200);
  }

  nextStreetView() {

    var panoramaId = this.streetView.getPano();
    var heading = this.streetView.getPov().heading;
    var myClass = this;

    this.getNextStreetView(panoramaId, heading, this.steps, function(pano) {
      myClass.updateStreetView(pano);
    });
  }

  getNextStreetView(panoramaId, heading, steps, callback) {

    if(steps == 0) {
      callback(panoramaId);
    }
    else {
      var myClass = this;
      this.getNextLink(panoramaId, heading, function(link) {
        myClass.getNextStreetView(link.pano, link.heading, steps - 1, callback);
      });
    }
  }

  getNextLink(panoramaId, prevHeading, callback) {

    this.streetViewLookAhead.getPanoramaById(panoramaId, function(data, status) {
      if(status === "OK") {
        var links = data.links;
        var nextHeading = links[0].heading;
        var index = 0;

        for(var i = 1; i < links.length; i++) {
          if(Math.min((links[i].heading - prevHeading + 360) % 360, (prevHeading - links[i].heading + 360) % 360) < Math.min((nextHeading - prevHeading + 360) % 360, (prevHeading - nextHeading + 360) % 360)) {
            nextHeading = links[i].heading;
            index = i;
          }
        }
        callback(links[index]);
      }
    });
  }
}
