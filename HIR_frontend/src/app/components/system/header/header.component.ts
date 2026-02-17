import { Component } from '@angular/core';
import { ImageModule } from 'primeng/image';
import { Toolbar } from 'primeng/toolbar';
import { AvatarModule } from 'primeng/avatar';
import { SharedModule } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { AutoCompleteModule } from 'primeng/autocomplete';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [ImageModule, Toolbar, AvatarModule, SharedModule, ButtonModule, FormsModule, AutoCompleteModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  selectedItem: any;
  filteredItems: any[] = [];

  filterItems(event: any) {}

  items: any[] = [];



}
