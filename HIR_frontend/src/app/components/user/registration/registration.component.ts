import { Component, OnInit } from '@angular/core';
import { FloatLabelModule } from "primeng/floatlabel"
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ApiService } from '../../../services/api.service';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { User } from '../../../interfaces/user';
import { MessageService } from 'primeng/api';
import { PasswordModule } from 'primeng/password';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [FloatLabelModule,InputTextModule,FormsModule,  ButtonModule, InputGroupModule, InputGroupAddonModule,PasswordModule],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss'
})
export class RegistrationComponent  {


  user:User = {
    id: "",
    name: "",
    email: "",
    backup_email: "",
    password: "",
    confirmPassword: "",
    address: "",
    phone: ""
  };

  constructor(
    private api: ApiService,
    private messageService: MessageService,
    private router:Router
  ) { }

  register(){
    if (this.user.password != this.user.confirmPassword){
      this.messageService.add({severity:'error', summary: 'Hiba', detail: 'A jelszavak nem egyeznek!', key: 'br', life: 3000});
      return;
    }
    if (!this.user.name || !this.user.email || !this.user.password || !this.user.address || !this.user.phone){
      this.messageService.add({severity:'error', summary: 'Hiba', detail: 'Kérem töltse ki az összes mezőt!', key: 'br', life: 3000});
      return;
    }
    if(this.user.password!== this.user.confirmPassword){
      this.messageService.add({severity:'error', summary: 'Hiba', detail: 'A jelszavak nem egyeznek!', key: 'br', life: 3000});
      return;
    }

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
          this.user.name = "";
          this.user.email = "";
          this.user.backup_email = "";
          this.user.password = "";
          this.user.confirmPassword = "";
          this.user.address = "";
          this.user.phone = "";

          this.router.navigateByUrl("login");
      },
      error: (err) => {
        this.messageService.add({severity:'error', summary: 'Hiba', detail: 'Sikertelen regisztráció!', key: 'br', life: 3000});
        console.error(err);
      }
    });
  }



  
}
