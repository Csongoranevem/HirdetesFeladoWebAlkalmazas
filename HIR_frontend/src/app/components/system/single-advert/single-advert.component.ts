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
  averageRating: number | null = null;
  loggedUserId: string | null = null;
  isSubmittingRating: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private messageService: MessageService,
    private auth: AuthService
  ) { }

  ngOnInit(): void {
    this.scrollToTop();
    this.loggedUserId = this.auth.GetLoggedUser()?.id ?? null;
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
        this.getAllratingsForAd();
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

    this.api.selectAll('ratings').subscribe({
      next: (response) => {
        const allRatings = this.normalizeRatingsResponse(response);
        const advertRatings = allRatings.filter((item) => String(item.ad_id) === String(this.advert?.id));

        this.ratings = this.getUniqueRatingsPerUser(advertRatings);
        this.updateAverageRating();
        this.syncUserRating();
      },
      error: (err) => {
        console.error(err);
        this.ratings = [];
        this.updateAverageRating();
      }
    });
  }

  submitRating(): void {
    if (!this.advert?.id) {
      this.messageService.add({ severity: 'error', summary: 'Hiba', detail: 'Hirdetés nem található!', key: 'br' });
      return;
    }

    if (!this.loggedUserId) {
      this.messageService.add({ severity: 'warn', summary: 'Bejelentkezés szükséges', detail: 'Értékeléshez jelentkezz be!', key: 'br' });
      return;
    }

    const normalizedRating = Math.round(this.userRating);

    if (normalizedRating < 1 || normalizedRating > 5) {
      this.messageService.add({ severity: 'warn', summary: 'Hiányzó értékelés', detail: 'Kérlek adj meg 1 és 5 közötti értékelést!', key: 'br' });
      return;
    }

    const advertId = this.advert.id;
    const loggedUserId = this.loggedUserId;

    this.isSubmittingRating = true;

    this.api.selectAll('ratings').subscribe({
      next: (response) => {
        const allRatings = this.normalizeRatingsResponse(response);

        const ownRatingsForAdvert = allRatings
          .filter((item) =>
            String(item.ad_id) === String(advertId) &&
            String(item.user_id) === String(loggedUserId)
          )
          .sort((a, b) => this.getRatingIdValue(b) - this.getRatingIdValue(a));

        const existingRating = ownRatingsForAdvert[0];
        const duplicateRatings = ownRatingsForAdvert.slice(1);

        if (existingRating && Number(existingRating.rating) === normalizedRating) {
          if (duplicateRatings.length > 0) {
            this.cleanupDuplicateRatings(duplicateRatings);
          }

          this.isSubmittingRating = false;
          this.messageService.add({ severity: 'info', summary: 'Nincs változás', detail: 'Már ezt az értékelést adtad meg.', key: 'br' });
          this.getAllratingsForAd();
          return;
        }

        const payload = {
          ad_id: advertId,
          rating: normalizedRating,
          user_id: loggedUserId
        };

        const request$ = existingRating
          ? this.api.update('ratings', String(existingRating.id), payload)
          : this.api.insert('ratings', payload);

        request$.subscribe({
          next: () => {
            if (duplicateRatings.length > 0) {
              this.cleanupDuplicateRatings(duplicateRatings);
            }

            this.userRating = normalizedRating;
            this.messageService.add({
              severity: 'success',
              summary: 'Siker',
              detail: existingRating ? 'Értékelés frissítve!' : 'Értékelés rögzítve!',
              key: 'br'
            });
            this.isSubmittingRating = false;
            this.getAllratingsForAd();
          },
          error: (err) => {
            console.error(err);
            this.isSubmittingRating = false;
            this.messageService.add({ severity: 'error', summary: 'Hiba', detail: 'Értékelés mentése sikertelen!', key: 'br' });
          }
        });
      },
      error: (err) => {
        console.error(err);
        this.isSubmittingRating = false;
        this.messageService.add({ severity: 'error', summary: 'Hiba', detail: 'Értékelés mentése sikertelen!', key: 'br' });
      }
    });
  }

  get isLoggedIn(): boolean {
    return !!this.loggedUserId;
  }

  private updateAverageRating(): void {
    if (!this.advert) {
      return;
    }

    if (this.ratings.length === 0) {
      this.averageRating = null;
      this.advert.rating = undefined;
      return;
    }

    const total = this.ratings.reduce((sum, current) => sum + Number(current.rating || 0), 0);
    this.averageRating = total / this.ratings.length;
    this.advert.rating = this.averageRating;
  }

  private syncUserRating(): void {
    if (!this.loggedUserId || !this.advert?.id) {
      this.userRating = 0;
      return;
    }

    const currentUserRating = this.ratings.find((item) =>
      String(item.ad_id) === this.advert?.id && String(item.user_id) === this.loggedUserId
    );

    this.userRating = currentUserRating ? Number(currentUserRating.rating) : 0;
  }

  private normalizeRatingsResponse(response: unknown): Rating[] {
    if (Array.isArray(response)) {
      return response as Rating[];
    }

    if (response && typeof response === 'object') {
      return [response as Rating];
    }

    return [];
  }

  private getUniqueRatingsPerUser(ratings: Rating[]): Rating[] {
    const latestByUser = new Map<string, Rating>();

    ratings.forEach((item) => {
      const userKey = String(item.user_id);
      const existing = latestByUser.get(userKey);

      if (!existing || this.getRatingIdValue(item) >= this.getRatingIdValue(existing)) {
        latestByUser.set(userKey, item);
      }
    });

    return Array.from(latestByUser.values());
  }

  private cleanupDuplicateRatings(duplicates: Rating[]): void {
    duplicates.forEach((item) => {
      this.api.delete('ratings', String(item.id)).subscribe({
        error: (err) => {
          console.error(err);
        }
      });
    });
  }

  private getRatingIdValue(item: Rating): number {
    const parsed = Number(item.id);
    return Number.isNaN(parsed) ? 0 : parsed;
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
  
  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
