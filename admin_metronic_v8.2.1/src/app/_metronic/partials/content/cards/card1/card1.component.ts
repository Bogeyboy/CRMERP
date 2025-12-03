import { Component, HostBinding, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-card1',
  templateUrl: './card1.component.html',
})
export class Card1Component implements OnInit {
  @HostBinding('class') class = 'card';
  @Input() color = '';
  @Input() avatar = '';
  @Input() online = false;
  @Input() name = '';
  @Input() job = '';
  @Input() avgEarnings = '';
  @Input() totalEarnings = '';
  constructor() {}

  ngOnInit(): void {}
}
