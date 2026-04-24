import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-logout',
  standalone: true,
  imports: [],
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.scss'
})
export class LogoutComponent implements OnInit{

  constructor(
    private auth: AuthService,
       private router: Router,
       private messageService: MessageService
  ){}
  ngOnInit(): void {
    this.logout();

  }

 async logout(){
  try {
    await this.auth.logout();
    this.router.navigateByUrl('home').then(() => {
      this.messageService.add({severity:'success', summary: 'Sikeres kijelentkezés', detail: 'Viszlát!'});

      setTimeout(() => {
        window.location.reload();
      }, 500);
      
    });
    
  } catch (error) {
    this.messageService.add({severity:'error', summary: 'Hiba', detail: 'Nem sikerült kijelentkezni. Kérem próbálja újra.'});

  }

  }
}
