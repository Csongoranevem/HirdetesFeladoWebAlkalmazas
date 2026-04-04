import { Component, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { Ad } from '../../../interfaces/ad';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { MessageService } from 'primeng/api';
import { environment } from '../../../../environments/environment.development';
import { CarouselModule } from 'primeng/carousel';
import { CurrencyPipe } from '@angular/common';
import { AccordionModule } from 'primeng/accordion';
import { catchError, forkJoin, of } from 'rxjs';
import { Category } from '../../../interfaces/category';
import { User } from '../../../interfaces/user';
import { Payment } from '../../../interfaces/payments';
import { RatingModule } from 'primeng/rating';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { Rating } from '../../../interfaces/ratings';
import { AuthService } from '../../../services/auth.service';

interface City {
  id: string;
  name: string;
}

@Component({
  selector: 'app-single-advert',
  standalone: true,
  imports: [CardModule, CarouselModule, CurrencyPipe, AccordionModule, RatingModule, ButtonModule, FormsModule],
  templateUrl: './single-advert.component.html',
  styleUrl: './single-advert.component.scss'
})
export class SingleAdvertComponent implements OnInit {

  advert?: Ad;
  adImages: string[] = [];
  categoryName: string = 'Nincs kategória';
  uploaderName: string = 'Ismeretlen feltöltő';
  cityName: string = 'Ismeretlen város';
  paymentMethodName: string = 'Nincs megadva';
  uploadedAtLabel: string = 'Nincs dátum';
  userRating: number = 0;
  ratings: Rating[] = [];

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private messageService: MessageService,
    private auth: AuthService
  ) { }

  ngOnInit(): void {
    this.scrollToTop();
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.messageService.add({ severity: 'error', summary: 'Hiba', detail: 'Nem található hirdetés!', key: 'br' });
      return;
    }

    this.api.selectById('adverts', id).subscribe({
      next: (res) => {
        this.advert = res as Ad;
        this.getAdAllImage(this.advert);
        this.setUploadedAt(this.advert.date_of_upload);
        this.loadRelatedData(this.advert);
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Hiba', detail: 'Hirdetés betöltése sikertelen!', key: 'br' });
        console.error(err);
      }
    });
  }

  getAdAllImage(ad: Ad): void {
    if (ad.images && ad.images.length > 0) {
      this.adImages = ad.images
        .map((img) => `${environment.serverUrl}${img.url}`)
        .filter((url) => !!url);
      return;
    }

    this.adImages = [];
  }

  private setUploadedAt(date: Date | string | undefined): void {
    if (!date) {
      this.uploadedAtLabel = 'Nincs dátum';
      return;
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      this.uploadedAtLabel = 'Nincs dátum';
      return;
    }

    this.uploadedAtLabel = parsedDate.toLocaleString('hu-HU', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getAllratingsForAd(): void {
    if (!this.advert || !this.advert.id) {
      this.messageService.add({ severity: 'error', summary: 'Hiba', detail: 'Hirdetés nem található!', key: 'br' });
      return;
    }

    this.api.selectByField('ratings', 'ad_id', 'eq', this.advert.id).subscribe({
      next: (ratings) => {
        this.ratings = ratings as Rating[];
      }
    });
  }

  private loadRelatedData(ad: Ad): void {
    const categoryRequest = ad.category_id
      ? this.api.selectById('categories', ad.category_id).pipe(catchError(() => of(null)))
      : of(null);

    const userRequest = ad.user_id
      ? this.api.selectById('users', ad.user_id).pipe(catchError(() => of(null)))
      : of(null);

    const cityRequest = ad.city_id
      ? this.api.selectById('cities', ad.city_id).pipe(catchError(() => of(null)))
      : of(null);

    const paymentRequest = ad.payment_method
      ? this.api.selectById('payments', ad.payment_method).pipe(catchError(() => of(null)))
      : of(null);

    forkJoin({
      category: categoryRequest,
      user: userRequest,
      city: cityRequest,
      payment: paymentRequest
    }).subscribe(({ category, user, city, payment }) => {
      this.categoryName = (category as Category | null)?.name ?? 'Nincs kategória';
      this.uploaderName = (user as User | null)?.name ?? 'Ismeretlen feltöltő';
      this.cityName = (city as City | null)?.name ?? 'Ismeretlen város';
      this.paymentMethodName = (payment as Payment | null)?.name ?? ad.payment_method ?? 'Nincs megadva';
    });
  }

  submitRating(): void {
    if (!this.advert || !this.advert.id) {
      this.messageService.add({ severity: 'error', summary: 'Hiba', detail: 'Hirdetés nem található!', key: 'br' });
      return;
    }
    const userId = this.auth.GetLoggedUser()?.id;
    if (!userId) {
      this.messageService.add({ severity: 'error', summary: 'Hiba', detail: 'Kérem jelentkezzen be a értékeléshez!', key: 'br' });
      return;
    }
  }

  getAdAvgRating(): number {

    this.api.selectByField('ratings', 'ad_id', 'eq', this.advert?.id ?? '').subscribe({
      next: (ratings) => {
        this.ratings = ratings as Rating[];
        if (this.ratings.length > 0) {
          const sum = this.ratings.reduce((acc, rating) => acc + rating.rating, 0);
          this.advert!.rating = sum / this.ratings.length;
        }
      }
    });
    return this.advert!.rating? this.advert!.rating : 0;
  }


  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
