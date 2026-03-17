import { Component, LOCALE_ID, OnInit } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import localeHu from '@angular/common/locales/hu';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DecimalPipe } from '@angular/common';
import { Ad } from '../../../interfaces/ad';
import { ApiService } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';
import { environment } from '../../../../environments/environment';
import { Router, RouterModule } from '@angular/router';

registerLocaleData(localeHu);

@Component({
  selector: 'app-cards',
  standalone: true,
  imports: [CardModule, ButtonModule, DecimalPipe, CommonModule, RouterModule],
  templateUrl: './cards.component.html',
  styleUrl: './cards.component.scss',
  providers: [{ provide: LOCALE_ID, useValue: 'hu' }]
})
export class CardsComponent implements OnInit {

  ads: Ad[] = [];

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getAds();
  }


  getAds() {
    this.apiService.selectByField('adverts', 'status', 'eq', 'active').subscribe(adverts => {
      this.ads = adverts as Ad[];
    });
  }

  getAdImage(ad: Ad): string {
    if (ad.images && ad.images.length > 0) {
      return `${environment.serverUrl}${ad.images[0].url}`;
    }
    return 'https://primefaces.org/cdn/primeng/images/card-ng.jpg';
  }

    openAdvert(id?: string) {
    if (!id) return;
    this.router.navigate(['/singleAdvert', id]);
  }

}
