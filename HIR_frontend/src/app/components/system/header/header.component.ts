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
import { Router, RouterLink } from '@angular/router';
import { Dialog, DialogModule } from 'primeng/dialog';
import { SplitterModule } from 'primeng/splitter';
import { CommonModule } from '@angular/common';
import { DividerModule } from 'primeng/divider';
import { ScrollPanel, ScrollPanelModule } from 'primeng/scrollpanel';
import { UploaderModule } from "angular-uploader";

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
    MenuModule,
    Dialog,
    DialogModule,
    SplitterModule,
    CommonModule,
    DividerModule,
    ScrollPanelModule,
    UploaderModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {


  ProfileVisible: boolean = false;
  loggedUsername: string = 'Username';
  CurrentProfileModalContent: number = 0
  showProfileModal() {
      this.ProfileVisible = true;
  }
  ChangeModalNumber(nu:number){
    this.CurrentProfileModalContent = nu
  }


  ngOnInit(): void {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      this.toggleTheme();
    }
  }

  constructor(
    private auth: AuthService,
    private router: Router
  ) {
    //subscribe
    this.auth.isLoggedIn$.subscribe(logged => {
      this.isLoggedIn = logged;
      this.sign = logged ? "Kijelentkezés" : "Bejelentkezés";
    });
  }

  isAdmin: boolean = false;
  selectedItem: any;
  filteredItems: any[] = [];

  sign: string = this.auth.isLoggedUser() ? "Kijelentkezés" : "Bejelentkezés";
  isLoggedIn: boolean = this.auth.isLoggedUser();

  filterItems(event: any) { }




  items: any[] = [
    ...this.isLoggedIn ? [
      { label: 'Profil', icon: 'pi pi-user', routerLink: '/profil ' },
      { label: 'Hirdetéseim', icon: 'pi pi-list', routerLink: '/myads ' },
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

  onLogoClick() {
    // Átirányítás a kezdőlapra

    this.router.navigate(['/home']);
  }

  ChangeNickname(){
  }

}

