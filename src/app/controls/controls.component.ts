import { Component, OnInit } from '@angular/core';
import { StreetViewComponent } from '../street-view/street-view.component';
import { CommunicationService } from '../communication.service'
import { Options } from 'ng5-slider';

@Component({
  selector: 'app-controls',
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.scss']
})
export class ControlsComponent implements OnInit {

  stepValue: number = 1;
  stepOptions: Options = {
    floor: 1,
    ceil: 10,
    showTicks: true,
    tickStep: 1
  };

  constructor(private streetView: StreetViewComponent, private comms: CommunicationService) { }

  ngOnInit() {
  }

  onNext() {
    this.streetView.nextStreetView();
  }

  onStepChange() {
    this.comms.changeStepsValue(this.stepValue);
  }
}
