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
import { WishlistComponent } from '../wishlist/wishlist.component';



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
    UploaderModule,
    WishlistComponent
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
      console.log('Initial ProfileData:', this.ProfileData);
      
      this.api.selectById('users', this.ProfileData!.id).subscribe(
        (user: any) => {
          console.log('Raw backend response:', user);
          console.log('Profile picture field:', user.profile_picture);
          
          this.ProfileData = user;
          console.log('User data refreshed:', this.ProfileData);
          console.log('Profile picture field:', this.ProfileData?.profile_picture);
        },
        (error) => {
          console.error('Error fetching user data:', error);
        }
      );
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
      this.saveProfileData();
    }
  }

  saveProfileData(){
    if (!this.ProfileData?.id) {
      console.error('User ID not found');
      return;
    }

    const updateData = {
      firstName: this.ProfileData.firstName,
      lastName: this.ProfileData.lastName,
      phone: this.ProfileData.phone,
      address: this.ProfileData.address,
      profile_picture: this.ProfileData.profile_picture
    };

    this.api.update('users', this.ProfileData.id, updateData).subscribe(
      (response) => {
        console.log('Profile updated successfully', response);
        this.messageService.add({
          severity: 'success',
          summary: 'Sikeres frissítés',
          detail: 'Profil sikeresen frissítve!',
          key: 'br'
        });
      },
      (error) => {
        console.error('Error updating profile', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Hiba',
          detail: 'Profil frissítése sikertelen!',
          key: 'br'
        });
      }
    );
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

  uploadedFileUrl: string = ''
  uploader = Uploader({
    apiKey: 'free', // <-- Get production-ready API keys from Bytescale
  });
  options: UploadWidgetConfig = {
    multi: false,
  };
  
  onComplete = (files: UploadWidgetResult[]) => {
    if (files && files.length > 0) {
      this.uploadedFileUrl = files[0]?.fileUrl;
      console.log(this.uploadedFileUrl);
      
      // Update profile picture in component
      if (this.ProfileData) {
        this.ProfileData.profile_picture = this.uploadedFileUrl;
      }
      
      // Save to database
      this.saveProfilePictureToDatabase(this.uploadedFileUrl);
    }
  };

  saveProfilePictureToDatabase(imageUrl: string) {
    if (!this.ProfileData?.id) {
      console.error('User ID not found');
      return;
    }

    const updateData = {
      profile_picture: imageUrl
    };

    this.api.update('users', this.ProfileData.id, updateData).subscribe(
      (response) => {
        console.log('Profile picture updated successfully', response);
        this.messageService.add({
          severity: 'success',
          summary: 'Sikeres frissítés',
          detail: 'Profilkép sikeresen frissítve!',
          key: 'br'
        });
      },
      (error) => {
        console.error('Error updating profile picture', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Hiba',
          detail: 'Profilkép frissítése sikertelen!',
          key: 'br'
        });
      }
    );
  }


}

