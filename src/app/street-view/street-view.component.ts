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
  currentRoad = "";
  lookAheadFOV = 160;

  panoRelDict = {};
  nextLinks = {};
  isJunction = {};
  hasChildren = {};

  constructor(private comms: CommunicationService, private http: HttpService) { }

  ngOnInit() {

    this.streetView = new google.maps.StreetViewPanorama(document.getElementById("street-view"));
    this.streetViewLookAhead = new google.maps.StreetViewService();

    this.comms.currentCoords.subscribe(coords => this.setStreetViewLocation(coords[0], coords[1]));
    this.comms.currentSteps.subscribe(stepValue => this.steps = stepValue);

    navigator.geolocation.getCurrentPosition(position => {
      this.setStreetViewLocation(position.coords.latitude, position.coords.longitude);
    });

    this.streetView.addListener("pano_changed", () => {
      setTimeout(() => this.currentRoad = this.streetView.getLocation().shortDescription, 1000);
    });
  }

  setStreetViewLocation(lat: number, lng: number) {

    this.http.getPanoramaId(lat, lng).subscribe(result => {
      console.log(result);
      this.updateStreetView(result['pano_id'], null);
    });
  }

  updateStreetView(panoramaId: string, prevHeading: number) {

    var myClass = this;
    this.streetView.setPano(panoramaId);

    setTimeout(function() {
      if(prevHeading == null)
        myClass.streetView.setPov({heading: myClass.streetView.getLinks()[0].heading, pitch: 0});
      else
        myClass.streetView.setPov({heading: prevHeading, pitch: 0});
    }, 200);
  }

  nextStreetView() {

    this.panoRelDict = {};
    this.nextLinks = {};
    this.isJunction = {};
    this.hasChildren = {};
    var location = [this.streetView.getLocation().pano, this.streetView.getPov().heading, this.streetView.getLocation().shortDescription];
    var returned = false;

    this.lookAhead(this.streetView.getLinks(), location, this.steps, () => {
      if(!returned) {
        returned = true;
        setTimeout(() => {
          /*console.log(this.panoRelDict);
          console.log(this.nextLinks);
          console.log(this.isJunction);
          console.log(this.streetView.getPano());*/

          var result = this.getBestPath(this.getKeyByValue(this.panoRelDict, this.streetView.getPano())[0]);
          //console.log(result);

          if(this.nextLinks[this.panoRelDict[result[0]]])
            this.updateStreetView(result[0], this.nextLinks[this.panoRelDict[result[0]]].heading);
          else
            this.updateStreetView(result[0], this.streetView.getPov().heading);
        }, 200)
      }
    });
  }

  lookAhead(links: google.maps.StreetViewLink[], curLocation, steps: number, callback) {

    if(steps == 0) {
      callback();
      return;
    }
    else {
      var myClass = this;

      for(var i = 0; i < links.length; i++) {
        if(Math.min((links[i].heading - curLocation[1] + 360) % 360, (curLocation[1] - links[i].heading + 360) % 360) <= this.lookAheadFOV) {

          ((myLink, myPrev, mySteps) => this.streetViewLookAhead.getPanoramaById(links[i].pano, function(data, status) {
            if(status === "OK") {

              myClass.panoRelDict[myLink.pano] = myPrev[0];
              myClass.nextLinks[myLink.pano] = myLink;
              myClass.isJunction[myLink.pano] = false;

              if(data.links.length < 2)
                myClass.hasChildren[myLink.pano] = false;
              else
                myClass.hasChildren[myLink.pano] = true;

              if(data.links.length > 2) {
                for(var j = 0; j < data.links.length; j++) {
                  if(!myLink.description.includes(data.links[j].description)) {
                    myClass.isJunction[myLink.pano] = true;
                    break;
                  }
                }
              }
              var location = [data.location.pano, myLink.heading, data.location.shortDescription];
              myClass.lookAhead(data.links, location, mySteps - 1, callback);
            }
          }))(links[i], curLocation, steps);
        }
      }
    }
  }

  getBestPath(currentPano: string) {

    if(this.isJunction[currentPano]) {
      return [currentPano, true];
    }
    else if(!this.hasChildren[currentPano]) {
      return false;
    }
    else {
      var next = this.getKeyByValue(this.panoRelDict, currentPano);

      if(next.length == 0) {
        return [currentPano, false];
      }
      else {

        var prevHeading = this.nextLinks[currentPano].heading;
        var angles = {};

        for(var i = 0; i < next.length; i++) {
          angles[i] = Math.min((this.nextLinks[next[i]].heading - prevHeading + 360) % 360, (prevHeading - this.nextLinks[next[i]].heading + 360) % 360);
        }
        var sortedList = this.sortObject(angles);

        for(var i = 0; i < next.length; i++) {
          var result = this.getBestPath(next[sortedList[i][0]]);
          if(result != false)
            return result;
        }
        return false;
      }
    }
  }

  getKeyByValue(object: object, value: string) {
    return Object.keys(object).filter(key => object[key] === value);
  }

  sortObject(object: object) {

    var items = Object.keys(object).map(function(key) {
        return [key, object[key]];
    });
    items.sort(function(first, second) {
        return first[1] - second[1];
    });
    return(items)
  }
}
