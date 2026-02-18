import { Component, OnInit } from '@angular/core';
import { FloatLabelModule } from "primeng/floatlabel"
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ApiService } from '../../../services/api.service';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { User } from '../../../interfaces/user';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [FloatLabelModule,InputTextModule,FormsModule,  ButtonModule, InputGroupModule, InputGroupAddonModule],
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

  constructor(private api: ApiService) { }

  register(){
    if (this.user.password != this.user.confirmPassword){
      alert("A jelszavak nem egyeznek!");
      return;
    }
    if (!this.user.name || !this.user.email || !this.user.password || !this.user.address || !this.user.phone){
      alert("Kérem töltse ki az összes mezőt!");
      return;
    }
    if(this.user.password!== this.user.confirmPassword){
      alert("A jelszavak nem egyeznek!");
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
        alert("Sikeres regisztráció!");
        console.log(res);
          this.user.name = "";
          this.user.email = "";
          this.user.backup_email = "";
          this.user.password = "";
          this.user.confirmPassword = "";
          this.user.address = "";
          this.user.phone = "";
      },
      error: (err) => {
        alert("Sikertelen regisztráció!");
        console.error(err);
      }
    });
  }



  
}
