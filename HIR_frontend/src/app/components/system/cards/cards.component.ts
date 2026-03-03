import { Component, LOCALE_ID, OnInit } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import localeHu from '@angular/common/locales/hu';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DecimalPipe } from '@angular/common';
import { Ad } from '../../../interfaces/ad';
import { ApiService } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';

registerLocaleData(localeHu);

@Component({
  selector: 'app-cards',
  standalone: true,
  imports: [CardModule, ButtonModule, DecimalPipe, CommonModule],
  templateUrl: './cards.component.html',
  styleUrl: './cards.component.scss',
  providers: [{ provide: LOCALE_ID, useValue: 'hu' }]
})
export class CardsComponent implements OnInit {

  ads: Ad[] = [];

  constructor(
    private apiService: ApiService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.getAds();
  }


  getAds() {
    this.apiService.selectByField('adverts', 'status', 'eq', 'active').subscribe(adverts => {
      this.ads = adverts as Ad[];
    });
  }

  //itt kell a szűrés

}
