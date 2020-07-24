import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient) { }

  getNearestRoad(lat, lng) {
    return this.http.get(`https://roads.googleapis.com/v1/nearestRoads?points=${lat},${lng}&key=AIzaSyBogsOu9jd3xOUwtf4MN1ic91Qg8ij5yO0`);
  }

  getPanoramaId(lat, lng) {
     return this.http.get(`https://maps.googleapis.com/maps/api/streetview/metadata?location=${lat},${lng}&key=AIzaSyBogsOu9jd3xOUwtf4MN1ic91Qg8ij5yO0`);
  }
}
