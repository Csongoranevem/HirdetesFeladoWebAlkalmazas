import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logout',
  standalone: true,
  imports: [],
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.scss'
})
export class LogoutComponent implements OnInit{

  constructor(
       private router: Router
  ){}
  ngOnInit(): void {
    this.logout()
  }

  logout(){

    localStorage.removeItem('user');
    this.router.navigateByUrl('home');
    

  }
}
