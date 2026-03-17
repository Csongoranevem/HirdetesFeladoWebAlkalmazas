import { Component, OnInit } from '@angular/core';
import { CardsComponent } from '../../system/cards/cards.component';
import { Ad } from '../../../interfaces/ad';
import { ApiService } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';
import { environment } from '../../../../environments/environment.development';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { CommonModule } from '@angular/common';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-myads',
  standalone: true,
  imports: [CardsComponent, TableModule, TagModule, CommonModule, CurrencyPipe],
  templateUrl: './myads.component.html',
  styleUrl: './myads.component.scss'
})
export class MyadsComponent implements OnInit{
  myAds: Ad[] = [];

  constructor(
    private api:ApiService,
    private authService: AuthService
  ){}

  ngOnInit(): void {
    this.api.selectByField('adverts', 'user_id','eq', this.authService.GetLoggedUser().id || '').subscribe((data) => {
      this.myAds = data as Ad[];
      console.log(this.myAds);
    });
  }

  getAdImage(ad: Ad): string {
      if (ad.images && ad.images.length > 0) {
        return `${environment.serverUrl}${ad.images[0].url}`;
      }
      return 'https://primefaces.org/cdn/primeng/images/card-ng.jpg';
    }
}
