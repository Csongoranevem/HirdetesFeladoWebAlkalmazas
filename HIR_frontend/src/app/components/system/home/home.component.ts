import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { CardsComponent } from '../cards/cards.component';
import { Category } from '../../../interfaces/category';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule, CardsComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  tags: Category[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.getCategories();
  }

  getCategories() {
    this.apiService.selectAll('categories').subscribe(categories =>{
      this.tags = categories as Category[];
    });
  }
}
