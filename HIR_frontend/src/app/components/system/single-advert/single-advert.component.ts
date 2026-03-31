import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { Ad } from '../../../interfaces/ad';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { MessageService } from 'primeng/api';
import { environment } from '../../../../environments/environment.development';
import { CarouselModule } from 'primeng/carousel';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-single-advert',
  standalone: true,
  imports: [CardModule, CarouselModule, CurrencyPipe],
  templateUrl: './single-advert.component.html',
  styleUrl: './single-advert.component.scss'
})
export class SingleAdvertComponent {

  advert?: Ad;
  adImages: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.messageService.add({ severity: 'error', summary: 'Hiba', detail: 'Nem található hirdetés!', key: 'br' });
      return;
    }

    this.api.selectById('adverts', id).subscribe({
      next: (res) => {
        this.advert = res as Ad;
        this.getAdAllImage(this.advert);
        this.messageService.add({ severity: 'success', summary: 'Siker', detail: 'Hirdetés betöltve!', key: 'br' });
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Hiba', detail: 'Hirdetés betöltése sikertelen!', key: 'br' });
        console.error(err);
      }
    });
  }

  getAdAllImage(ad: Ad):void {
    if (ad.images && ad.images.length > 0) {
      this.adImages = ad.images.map((img: any) => `${environment.serverUrl}${img.url}`) || "no-image.png";
      
    }
  }
}
