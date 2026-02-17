import { Component } from '@angular/core';
import { ImageModule } from 'primeng/image';
import { Toolbar } from 'primeng/toolbar';
import { AvatarModule } from 'primeng/avatar';
import { SharedModule } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [ImageModule, Toolbar, AvatarModule, SharedModule, ButtonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

}
