import { Component } from '@angular/core';
import { Ad } from '../../../interfaces/ad';
import { CardModule } from 'primeng/card';


@Component({
  selector: 'app-interested-advert',
  standalone: true,
  imports: [CardModule],
  templateUrl: './interested-advert.component.html',
  styleUrl: './interested-advert.component.scss'
})
export class InterestedAdvertComponent {
  constructor() { }

}
