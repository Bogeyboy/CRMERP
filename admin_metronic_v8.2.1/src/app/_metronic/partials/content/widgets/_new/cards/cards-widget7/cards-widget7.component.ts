import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-cards-widget7',
  templateUrl: './cards-widget7.component.html',
  styleUrls: ['./cards-widget7.component.scss'],
})
export class CardsWidget7Component implements OnInit {
  @Input() cssClass = '';
  @Input() icon = false;
  @Input() stats = 357;
  @Input() description = 'Professionals';
  @Input() labelColor = 'dark';
  @Input() textColor = 'gray-300';
  items: { name: string; initials?: string; state?: string, src?: string }[];

  constructor() {}

  ngOnInit(): void {
    this.items = [
      { name: 'Alan Warden', initials: 'A', state: 'warning' },
      { name: 'Michael Eberon', src: './assets/media/avatars/300-11.jpg' },
      { name: 'Susan Redwood', initials: 'S', state: 'primary' },
      { name: 'Melody Macy', src: './assets/media/avatars/300-2.jpg' },
      { name: 'Perry Matthew', initials: 'P', state: 'danger' },
      { name: 'Barry Walter', src: './assets/media/avatars/300-12.jpg' },
    ];
  }
}
