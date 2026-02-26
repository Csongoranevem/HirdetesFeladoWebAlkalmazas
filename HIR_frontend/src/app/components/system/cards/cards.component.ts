import { Component, LOCALE_ID } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import localeHu from '@angular/common/locales/hu';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DecimalPipe } from '@angular/common';
import { Ad } from '../../../interfaces/ad';

registerLocaleData(localeHu);

@Component({
  selector: 'app-cards',
  standalone: true,
  imports: [CardModule, ButtonModule, DecimalPipe, CommonModule],
  templateUrl: './cards.component.html',
  styleUrl: './cards.component.scss',
  providers: [{ provide: LOCALE_ID, useValue: 'hu' }]
})
export class CardsComponent {

  ads: Ad[] = [
    {
      id: '1',
      user_id: '1',
      name: 'Termék 1',
      description: 'Ez egy nagyon király termék, itt a tessék, vedd már fel!',
      price: 10000,
      country_id: '1',
      product_id: '1',
      payment_method: 'Készpénz',
      category_id: '1',
      status: 'Aktív',
      date_of_upload: new Date()
    },
    {
      id: '2',
      user_id: '2',
      name: 'Termék 2',
      description: 'Ez egy másik nagyon király termék, itt a tessék, vedd már fel! Ez egy másik nagyon király termék, itt a tessék, vedd már fel!Ez egy másik nagyon király termék, itt a tessék, vedd már fel!Ez egy másik nagyon király termék, itt a tessék, vedd már fel!',
      price: 20000,
      country_id: '1',
      product_id: '2',
      payment_method: 'Banki átutalás',
      category_id: '2',
      status: 'Aktív',
      date_of_upload: new Date()
    },
    {
      id: '2',
      user_id: '2',
      name: 'Termék 2',
      description: 'Ez egy másik nagyon király termék, itt a tessék, vedd már fel!',
      price: 20000,
      country_id: '1',
      product_id: '2',
      payment_method: 'Banki átutalás',
      category_id: '2',
      status: 'Aktív',
      date_of_upload: new Date()
    },
    {
      id: '2',
      user_id: '2',
      name: 'Termék 2',
      description: 'Ez egy másik nagyon király termék, itt a tessék, vedd már fel! Ez egy másik nagyon király termék, itt a tessék, vedd már fel!Ez egy másik nagyon király termék, itt a tessék, vedd már fel!',
      price: 20000,
      country_id: '1',
      product_id: '2',
      payment_method: 'Banki átutalás',
      category_id: '2',
      status: 'Aktív',
      date_of_upload: new Date()
    }
  ];

  constructor() { }

}
