import { Component } from '@angular/core';
import { FloatLabelModule } from "primeng/floatlabel"
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ApiService } from '../../../services/api.service';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { User } from '../../../interfaces/user';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FloatLabelModule,InputGroupAddonModule,InputTextModule,FormsModule,ButtonModule,InputGroupModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

   keepLoggedIn: boolean = false;

  user: User = {
    id: '',
    name: '',
    email: '',
    backup_email: '',
    password: '',
    address: '',
    phone: ''
  }

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private router: Router

  ) { }


  getUserId() {
    this.api.readByField('users', 'email', "eq", this.user.email).subscribe({
      next: (user) => {
        localStorage.setItem('user', JSON.stringify(user));
        console.log('User data stored in localStorage:', user);
      }
    });
  }

  login() {


    let data = {
      email: this.user.email,
      password: this.user.password
    }

    this.api.login('users', data).subscribe({
      next: (res) => {
        this.auth.login((res as any).token);
        sessionStorage.setItem("id", (res as any).userId);

        if (this.keepLoggedIn) {
          this.auth.storeUser((res as any).token);
        }

        this.router.navigateByUrl('home');


      },
      error: (err) => {
        console.log('Hiba: ',err);
      }
    });

    this.getUserId();
  }


}
