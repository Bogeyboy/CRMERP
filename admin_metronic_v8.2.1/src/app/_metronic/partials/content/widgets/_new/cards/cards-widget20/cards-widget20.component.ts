import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-cards-widget20',
  templateUrl: './cards-widget20.component.html',
  styleUrls: ['./cards-widget20.component.scss'],
})
export class CardsWidget20Component implements OnInit {
  @Input() cssClass = '';
  @Input() description = '';
  @Input() color = '';
  @Input() img = '';
  constructor() {}

  ngOnInit(): void {}
}
