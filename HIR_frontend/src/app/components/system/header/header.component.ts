import { Component } from '@angular/core';
import { ImageModule } from 'primeng/image';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [ImageModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

}
