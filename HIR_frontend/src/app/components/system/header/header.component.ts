import { Component } from '@angular/core';
import { SearchbarComponent } from '../searchbar/searchbar.component';
import { NewAdComponent } from '../new-ad/new-ad.component';
import { ProfileSectionComponent } from '../profile-section/profile-section.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [SearchbarComponent, NewAdComponent, ProfileSectionComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

}
