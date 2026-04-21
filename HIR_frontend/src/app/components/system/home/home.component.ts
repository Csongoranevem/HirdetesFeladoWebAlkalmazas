import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { CardsComponent } from '../cards/cards.component';
import { Category } from '../../../interfaces/category';
import { ApiService } from '../../../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule, CardsComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  tags: Category[] = [];

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getCategories();
  }

  getCategories() {
    this.apiService.selectAll('categories').subscribe(categories =>{
      this.tags = categories as Category[];
    });
  }

  goToAdsWithCategory(category: Category) {
    // Navigálunk az ads oldalra, és query param-ben átadjuk a kategória id-ját.
    // Az AdsComponent ezt beolvassa és automatikusan beállítja a szűrőt.
    this.router.navigate(['ads'], { queryParams: { category: category.id } });
  }
}
