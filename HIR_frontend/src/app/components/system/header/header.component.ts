import { Component } from '@angular/core';
import { ImageModule } from 'primeng/image';
import { Toolbar } from 'primeng/toolbar';
import { SharedModule } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { SpeedDialModule } from 'primeng/speeddial';
import { SplitButtonModule } from 'primeng/splitbutton';
import { MenuModule } from 'primeng/menu';
 
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [ImageModule, 
    Toolbar, 
    SharedModule, 
    ButtonModule, 
    FormsModule, 
    AutoCompleteModule, 
    SpeedDialModule, 
    SplitButtonModule, 
    MenuModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  selectedItem: any;
  filteredItems: any[] = [];

  filterItems(event: any) { }

  items: any[] = [
    { label: 'Profil', icon: 'pi pi-user' },
    { label: 'Beállítások', icon: 'pi pi-cog' },
    { label: 'Kijelentkezés', icon: 'pi pi-sign-out' }
  ];
  isDarkTheme: boolean = false;

  toggleTheme() {
    const element = document.querySelector('html');
    element!.classList.toggle('my-app-dark');
    this.isDarkTheme = element!.classList.contains('my-app-dark');
  }
}
