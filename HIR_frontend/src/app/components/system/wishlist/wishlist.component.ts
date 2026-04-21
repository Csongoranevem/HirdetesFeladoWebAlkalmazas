import { Component, OnInit } from '@angular/core';
import { CardsComponent } from '../cards/cards.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ScrollerModule } from 'primeng/scroller';
import { ApiService } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';
import { MessageService } from 'primeng/api';
import { Wishlist } from '../../../interfaces/wishlists';
import { ScrollPanelModule } from 'primeng/scrollpanel';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CardsComponent,CommonModule,FormsModule,ScrollerModule,ScrollPanelModule],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.scss'
})
export class WishlistComponent implements OnInit{

  wishlistsList: Wishlist[] = [];
  wishlistAdIds: string[] = [];

  ngOnInit() {
    this.getWishlist();
  }

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private messageService: MessageService
  ){}

  getWishlist() {
    this.apiService.selectByField('wishlist', 'userId', 'eq', this.authService.GetLoggedUser().id).subscribe(wishlists => {
      this.wishlistsList = wishlists as Wishlist[];
      this.wishlistAdIds = this.wishlistsList.map(item => item.advertId);
    });
  }
}
