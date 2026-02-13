import { Component } from '@angular/core';
import { SearchbarComponent } from '../searchbar/searchbar.component';
import { NewAdComponent } from '../new-ad/new-ad.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [SearchbarComponent, NewAdComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

}
