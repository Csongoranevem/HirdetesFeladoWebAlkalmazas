import { Component, OnInit } from '@angular/core';
import { ImageModule } from 'primeng/image';
import { Toolbar } from 'primeng/toolbar';
import { MessageService, SharedModule } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { SpeedDialModule } from 'primeng/speeddial';
import { SplitButtonModule } from 'primeng/splitbutton';
import { MenuModule } from 'primeng/menu';
import { AuthService } from '../../../services/auth.service';
import { routes } from '../../../app.routes';
import { RouterLink } from '@angular/router';
 
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
export class HeaderComponent implements OnInit {


  ngOnInit(): void {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      this.toggleTheme();
    }
  }

  constructor(
    private auth: AuthService,

  ) {}

  isAdmin: boolean = false;
  selectedItem: any;
  filteredItems: any[] = [];

  sign: string = this.auth.isLoggedUser() ? "Kijelentkezés" : "Bejelentkezés";
  isLoggedIn: boolean = this.auth.isLoggedUser();

  filterItems(event: any) { }

  items: any[] = [
    ...this.isLoggedIn ? [
      { label: 'Profil', icon: 'pi pi-user', routerLink: '/profil '},
      { label: 'Hirdetéseim', icon: 'pi pi-list', routerLink: '/myads '},
    ] : [],
    
      { label: this.sign, icon: 'pi pi-sign-out', routerLink: this.isLoggedIn ? '/logout' : '/login' },
      { label: 'Regisztráció', icon: 'pi pi-user-plus', routerLink: '/registration' }];
  isDarkTheme: boolean = false;

  toggleTheme() {
    const element = document.querySelector('html');
    element!.classList.toggle('my-app-dark');
    this.isDarkTheme = element!.classList.contains('my-app-dark');
    localStorage.setItem('theme', this.isDarkTheme ? 'dark' : 'light');
  }

}

