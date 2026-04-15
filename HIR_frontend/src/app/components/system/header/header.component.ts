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
import { Router, RouterLink, RouterModule } from '@angular/router';
import { Dialog, DialogModule } from 'primeng/dialog';
import { SplitterModule } from 'primeng/splitter';
import { CommonModule } from '@angular/common';
import { DividerModule } from 'primeng/divider';
import { ScrollPanel, ScrollPanelModule } from 'primeng/scrollpanel';
import { FloatLabel } from 'primeng/floatlabel';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { Toast } from 'primeng/toast';
import { MyadsComponent } from '../../user/myads/myads.component';
import { ApiService } from '../../../services/api.service';
import { catchError, of } from 'rxjs';
import { User } from '../../../interfaces/user';
import { SupportComponent } from '../support/support.component';
import { InputText } from "primeng/inputtext";
import { BrowserModule } from "@angular/platform-browser";
import { UploaderModule } from "angular-uploader";
import { Uploader, UploadWidgetConfig, UploadWidgetResult } from 'uploader';



interface AdvertSearchResult {
  id: string;
  name: string;
  price?: number;
  status?: 'active' | 'inactive' | string;
  category?: {
    id?: string;
    name?: string;
  };
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    ImageModule,
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
    FloatLabel,
    CardModule,
    TableModule,
    RouterModule,
    Toast,
    MyadsComponent,
    SupportComponent,
    InputText,
    UploaderModule
],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {


  ProfileData: User | null = null;
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
    //get logged user data
    if(this.auth.isLoggedUser()) {
      this.ProfileData = this.auth.GetLoggedUser();
      console.log(this.ProfileData);
    }
  }

  constructor(
    private auth: AuthService,
    private router: Router,
    private messageService: MessageService,
    private api: ApiService
  ) {
    //subscribe
    this.auth.isLoggedIn$.subscribe(logged => {
      this.isLoggedIn = logged;
      this.sign = logged ? "Kijelentkezés" : "Bejelentkezés";
    });
  }

  isAdmin: boolean = this.auth.isAdmin();

  // --- KERESŐ / AUTOCOMPLETE ---
  // selectedItem: a mező aktuális értéke (szöveg vagy kiválasztott találat)
  // filteredItems: a backendből jövő találati lista a lenyíló panelhez
  selectedItem: AdvertSearchResult | string | null = null;
  filteredItems: AdvertSearchResult[] = [];

  sign: string = this.auth.isLoggedUser() ? "Kijelentkezés" : "Bejelentkezés";
  isLoggedIn: boolean = this.auth.isLoggedUser();

  // PrimeNG AutoComplete: gépeléskor meghívódik, és a backendből kér találatokat.
  filterItems(event: { query?: string }) {
    const query = String(event?.query ?? '').trim();

    if (!query) {
      this.filteredItems = [];
      return;
    }

    this.api.searchAdverts(query).pipe(
      catchError((err) => {
        console.error(err);
        return of([] as AdvertSearchResult[]);
      })
    ).subscribe((res) => {
      this.filteredItems = (res as AdvertSearchResult[]) ?? [];
    });
  }

  availabilityLabel(status?: string): string {
    return status === 'active' ? 'Elérhető' : 'Nem elérhető';
  }

  // Találat kiválasztásakor a SingleAdvert oldalra visz.
  onSelectItem(event: { value?: AdvertSearchResult }) {
    const selected = event?.value;
    if (!selected?.id) {
      return;
    }

    this.router.navigate(['/singleAdvert', selected.id]);
    this.selectedItem = null;
    this.filteredItems = [];
  }




  items: any[] = [
    ...this.isLoggedIn ? [
      { label: 'Profil', icon: 'pi pi-user', routerLink: '/profil ' },
      { label: 'Hirdetéseim', icon: 'pi pi-list', routerLink: '/myads' },
      ...this.isAdmin ? [{ label: "Felhasználók kezelése", icon: 'pi pi-users', routerLink: '/useractions' }] : []
    ] : [],

    ...!this.isLoggedIn ? [
      { label: 'Regisztráció', icon: 'pi pi-user-plus', routerLink: '/registration' },
    ] : [],
    
    { label: this.sign, icon: 'pi pi-sign-out', routerLink: this.isLoggedIn ? '/logout' : '/login' },];
  isDarkTheme: boolean = false;

  toggleTheme() {
    const element = document.querySelector('html');
    element!.classList.toggle('my-app-dark');
    this.isDarkTheme = element!.classList.contains('my-app-dark');
    localStorage.setItem('theme', this.isDarkTheme ? 'dark' : 'light');
  }

  navigateToHome() {
    // Átirányítás a kezdőlapra

    this.router.navigate(['/home']);
  }

  ProfileEditing:boolean = false;
  ProfileEdit(){
    if(this.ProfileEditing == false){
      this.ProfileEditing = true
    }
    else{
      this.ProfileEditing = false
    }
  }
  AccountEditing:boolean = false;
  EditAccount(){
    if(this.AccountEditing == false){
      this.AccountEditing = true
    }
    else{
      this.AccountEditing = false
    }
  }

  navigateToNewAdvert() {
    if (this.auth.isLoggedUser()) {
      this.router.navigate(['/newAdvert']);
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'Bejelentkezés szükséges',
        detail: 'Az új hirdetés feltöltéséhez be kell jelentkezz!',
        key: 'br'
      });
    }
  }



  //PFP 


}

