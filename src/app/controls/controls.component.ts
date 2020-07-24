import { Component, OnInit } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { StreetViewComponent } from '../street-view/street-view.component';
import { CommunicationService } from '../communication.service'
import { Options } from 'ng5-slider';

@Component({
  selector: 'app-controls',
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.scss'],
  animations: [
    trigger('focus', [
      state('unfocus', style({ opacity: 0.2 })),
      state('focus', style({ opacity: 0.9 })),
      transition('unfocus=>focus', animate('200ms')),
      transition('focus=>unfocus', animate('200ms'))
    ]),
  ]
})
export class ControlsComponent implements OnInit {

  stepValue: number = 1;
  stepOptions: Options = {
    floor: 1,
    ceil: 10,
    showTicks: true,
    tickStep: 1
  };
  animState = 'unfocus';

  setAnim(state) {
    this.animState = state;
  }

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
