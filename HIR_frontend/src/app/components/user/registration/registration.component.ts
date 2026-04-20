import { Component } from '@angular/core';

// UI (PrimeNG) modulok: a template-ben használt inputok/gombok/stíluselemek.
import { FloatLabelModule } from "primeng/floatlabel"
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { MessageService } from 'primeng/api';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';

// Alkalmazás-szintű szolgáltatások és típusok.
import { Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { User } from '../../../interfaces/user';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [FloatLabelModule, InputTextModule, FormsModule, ButtonModule, InputGroupModule, InputGroupAddonModule, PasswordModule, ToastModule],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss',
  providers: [MessageService]
})
export class RegistrationComponent  {

  /**
   * Kétirányú adatbinding (`ngModel`) célobjektuma a template-ben.
   * `confirmPassword` csak kliens oldali ellenőrzésre szolgál,
   * ezt NEM küldjük fel az API-nak.
   */
  user: User = {
    id: "",
    name: "",
    email: "",
    backup_email: "",
    password: "",
    confirmPassword: "",
    address: "",
    phone: "",
    role_id: 0
  };

  constructor(
    private api: ApiService,
    private messageService: MessageService,
    private router:Router
  ) { }

  /**
   * Regisztráció folyamata:
   * 1) kliens oldali validáció (kötelező mezők, jelszó egyezés)
   * 2) DTO összeállítása (csak a backend által várt mezők)
   * 3) API hívás → visszajelzés toast üzenettel
   * 4) siker esetén mezők ürítése + navigáció a login oldalra
   */
  register(): void {
    // 1) Egyszerű, gyors kliens oldali validációk (UX):
    if (this.user.password !== this.user.confirmPassword){
      this.messageService.add({severity:'error', summary: 'Hiba', detail: 'A jelszavak nem egyeznek!', key: 'br', life: 3000});
      return;
    }
    if (!this.user.name || !this.user.email || !this.user.password || !this.user.address || !this.user.phone){
      this.messageService.add({severity:'error', summary: 'Hiba', detail: 'Kérem töltse ki az összes mezőt!', key: 'br', life: 3000});
      return;
    }

    // 2) A backend felé küldött payload (ne küldjük a confirmPassword-öt).
    const data = {
      name: this.user.name,
      email: this.user.email,
      backup_email: this.user.backup_email,
      password: this.user.password,
      address: this.user.address,
      phone: this.user.phone
    };

    console.log("Registration data:", data);

    this.api.registration("users", data).subscribe({
      next: (res) => {
        this.messageService.add({severity:'success', summary: 'Siker', detail: 'Sikeres regisztráció!', key: 'br', life: 3000});
        console.log(res);

        // 3) Form állapotának visszaállítása (hogy ne maradjon benne érzékeny adat).
        this.user.name = "";
        this.user.email = "";
        this.user.backup_email = "";
        this.user.password = "";
        this.user.confirmPassword = "";
        this.user.address = "";
        this.user.phone = "";

        // 4) Következő logikus lépés: bejelentkezés.
        this.router.navigateByUrl("login");
      },
      error: (err) => {
        this.messageService.add({severity:'error', summary: 'Hiba', detail: 'Sikertelen regisztráció!', key: 'br', life: 3000});
        console.error(err);
      }
    });
  }



  
}
