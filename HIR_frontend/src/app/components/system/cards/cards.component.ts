import { Component, Input, LOCALE_ID, OnInit, Output, EventEmitter } from '@angular/core';
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
import { Category } from '../../../interfaces/category';
import { Wishlist } from '../../../interfaces/wishlists';
import { MessageService } from 'primeng/api';

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

  @Input() ads: Ad[] = [];
  @Input() filterByIds: string[] = [];
  @Input() compact: boolean = false;
  @Output() wishlistUpdated = new EventEmitter<void>();
  categories: Category[] = [];

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private messageService: MessageService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getAds();
    this.getCategories();
    this.loadAllWishlists();
  }

  getAds() {
    this.apiService.selectByField('adverts', 'status', 'eq', 'active').subscribe(adverts => {
      let filtered = adverts as Ad[];
      if (this.filterByIds.length > 0) {
        filtered = filtered.filter(ad => this.filterByIds.includes(ad.id!.toString()));
      }
      this.ads = filtered;
    });
  }

  getCategories(){
    this.apiService.selectAll('categories').subscribe(categories => {
      this.categories = categories as Category[];
    });
  }

  getCategoryName(categoryId: string): string {
    return this.categories.find(category => category.id === categoryId)?.name || '';
  }

  getAdImage(ad: Ad): string {
    if (ad.images && ad.images.length > 0) {
      return `${environment.serverUrl}${ad.images[0].url}`;
    }
    return 'no-image.png';
  }

  openAdvert(id?: string) {
    if (!id) return;
    this.router.navigate(['/singleAdvert', id]);
  }

  /// Wishlist

  newWishList: Wishlist = {
    id: '',
    userId: '',
    advertId: ''
  };
  allWishlists: Wishlist[] = [];

  loadAllWishlists() {
    this.apiService.selectAll('wishlist').subscribe(wishlists => {
      this.allWishlists = wishlists as Wishlist[];
    });
  }

  addToWishlist(adId: string) {
    this.newWishList.advertId = adId;
    this.newWishList.userId = this.authService.GetLoggedUser().id;

    const existing = this.allWishlists.find(wish => wish.userId === this.newWishList.userId && wish.advertId === this.newWishList.advertId);

    if (!existing) {
      this.apiService.insert('wishlist', this.newWishList).subscribe({
        next: (response) => {
          this.loadAllWishlists();
          this.wishlistUpdated.emit();
          this.messageService.add({ severity: 'success', summary: 'Siker', detail: 'Hozzáadva a kívánságlistához!' });
        },
        error: (error) => {
          this.messageService.add({ severity: 'error', summary: 'Hiba', detail: 'Hiba történt a kívánságlista hozzáadása során!' });
        }
      });
    } else {
      this.messageService.add({ severity: 'warn', summary: 'Figyelmeztetés', detail: 'Ez a hirdetés már szerepel a kívánságlistádban!' });
    }
  }

  removeFromWishlist(adId: string) {
    const existing = this.allWishlists.find(wish => wish.userId === this.authService.GetLoggedUser().id && wish.advertId === adId);

    if (existing) {
      this.apiService.delete('wishlist', String(existing.id)).subscribe({
        next: (response) => {
          this.loadAllWishlists();
          this.wishlistUpdated.emit();
          this.messageService.add({ severity: 'error', summary: 'Eltávolítva', detail: 'Eltávolítva a kívánságlistáról!' });
        },
        error: (error) => {
          this.messageService.add({ severity: 'error', summary: 'Hiba', detail: 'Hiba történt a kívánságlista eltávolítása során!' });
        }
      });
    }
  }

  IsInWishlist(adId: string): boolean {
    return this.allWishlists.some(wish => wish.userId === this.authService.GetLoggedUser().id && wish.advertId === adId);
  }
}
