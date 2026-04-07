import { Component } from '@angular/core';

// UI (PrimeNG) modulok: a template-ben használt inputok/gombok/stíluselemek.
import { FloatLabelModule } from "primeng/floatlabel"
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { PasswordModule } from 'primeng/password';

// Alkalmazás-szintű szolgáltatások és típusok.
import { Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../interfaces/user';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FloatLabelModule,InputGroupAddonModule,InputTextModule,FormsModule,ButtonModule,InputGroupModule, PasswordModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  /**
   * „Emlékezz rám” jellegű opció.
   * - `false`: csak a munkamenetben (sessionStorage) éljen a belépés.
   * - `true`: tartós bejelentkezéshez a token localStorage-ba is mentődik.
   */
  keepLoggedIn: boolean = false;

  /**
   * Kétirányú adatbinding (`ngModel`) célobjektuma a template-ben.
   * A loginhoz ténylegesen csak az `email` és `password` kell,
   * de a projektben egységesen a `User` típust használjuk.
   */
  user: User = {
    id: '',
    name: '',
    email: '',
    backup_email: '',
    password: '',
    address: '',
    phone: '',
    role_id: 0
  }

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private router: Router,
    private messageService: MessageService

  ) { }


  /**
   * Kiegészítő API-hívás: a felhasználó adatait lekéri email alapján,
   * majd eltárolja localStorage-ben.
   *
   * Megjegyzés: ezt csak sikeres bejelentkezés után érdemes futtatni,
   * hogy hibás belépési kísérletnél ne mentsünk el felhasználói adatot.
   */
  getUserId(): void {
    this.api.readByField('users', 'email', "eq", this.user.email).subscribe({
      next: (user) => {
        localStorage.setItem('user', JSON.stringify(user));
        console.log('User data stored in localStorage:', user);
      }
    });
  }

  /**
   * Beléptetés folyamata:
   * 1) összeállítjuk a minimális login payloadot (email + jelszó)
   * 2) API `login` hívás → token és userId érkezik
   * 3) token kezelése az `AuthService`-en keresztül
   * 4) navigáció a kezdőoldalra (és opcionális újratöltés)
   */
  login(): void {
    // 0) Gyors kliens oldali validáció (UX): ne is küldjünk üres requestet.
    if (!this.user.email?.trim() || !this.user.password?.trim()) {
      this.messageService.add({
        severity: 'error',
        summary: 'Hiba',
        detail: 'Kérem adja meg az email címet és a jelszót!',
        key: 'br',
        life: 3000
      });
      return;
    }

    const data = {
      email: this.user.email,
      password: this.user.password
    }

    this.api.login('users', data).subscribe({
      next: (res) => {
        // A token munkamenet-szintű mentése / beállítása (pl. interceptor számára).
        this.auth.login((res as any).token);

        // A userId gyors elérése kliens oldalon (pl. profilhoz, hirdetésekhez).
        sessionStorage.setItem("id", (res as any).userId);

        if (this.keepLoggedIn) {
          // Tartós bejelentkezés: token localStorage-ben is tárolódik.
          this.auth.storeUser((res as any).token);
        }

        // Sikeres belépés után lekérjük és eltároljuk a felhasználó adatait.
        this.getUserId();

        this.router.navigateByUrl('home');

        // UI/állapot frissítés: több helyen a header/menü a tárolt tokenből áll össze.
        // (Ez lehet később kiváltható állapotkezeléssel, de most a meglévő működést követjük.)
        setTimeout(() => {
          location.reload();
        }, 100);


      },
      error: (err) => {
        // Tipikus backend hibakódok: 400 (hiányzó mezők), 401 (rossz adatok), 403 (inaktív/tiltott).
        // `status === 0` általában hálózati hiba / nem elérhető backend.
        let detail = 'Sikertelen bejelentkezés. Kérem próbálja újra.';
        const status = (err as any)?.status;

        if (status === 0) detail = 'A szerver nem elérhető. Kérem próbálja később!';
        if (status === 400) detail = 'Email és jelszó megadása kötelező.';
        if (status === 401) detail = 'Hibás email cím vagy jelszó.';
        if (status === 403) detail = 'A fiók inaktív vagy tiltott.';

        this.messageService.add({ severity: 'error', summary: 'Hiba', detail, key: 'br', life: 3000 });
        console.log('Hiba: ', err);
      }
    });
  }


}
