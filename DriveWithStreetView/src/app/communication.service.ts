import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root'
})
export class CommunicationService {

  private coords = new BehaviorSubject<number[]>([0, 0]);
  currentCoords = this.coords.asObservable();

  changeCoords(newCoords: number[]) {
    this.coords.next(newCoords);
  }
}
