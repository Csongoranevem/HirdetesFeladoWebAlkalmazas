import { Component } from '@angular/core';
import { CardsComponent } from '../../system/cards/cards.component';

@Component({
  selector: 'app-myads',
  standalone: true,
  imports: [CardsComponent],
  templateUrl: './myads.component.html',
  styleUrl: './myads.component.scss'
})
export class MyadsComponent {

}
