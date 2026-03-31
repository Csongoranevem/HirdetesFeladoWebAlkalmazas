import { Component } from '@angular/core';
import { DrawerModule } from 'primeng/drawer';
import { Button, ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DividerModule } from 'primeng/divider';
import { FormsModule } from '@angular/forms';
import { Slider } from 'primeng/slider';
import { AccordionModule } from 'primeng/accordion';
import { Checkbox } from 'primeng/checkbox';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { Fluid } from 'primeng/fluid';
import { FloatLabel } from 'primeng/floatlabel';
import { MenuItemContent, MenuModule } from 'primeng/menu';
import { InputGroup } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { AutoComplete } from 'primeng/autocomplete';
import { Select } from 'primeng/select';
import { CardsComponent } from '../cards/cards.component';
import { Ad } from '../../../interfaces/ad';
import { ApiService } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';
import { environment } from '../../../../environments/environment.development';
import { Category } from '../../../interfaces/category';

interface SortBy {
  label: string;
  value: number;
}

@Component({
  selector: 'app-ads',
  standalone: true,
  imports: [
    CommonModule,
    DrawerModule,
    RouterModule,
    Button,
    InputGroup,
    InputGroupAddonModule,
    ButtonModule,
    DividerModule,
    FormsModule,
    Slider,
    AccordionModule,
    Checkbox,
    ToggleSwitchModule,
    Fluid,
    InputTextModule,
    FloatLabel,
    MenuModule,
    MenuItemContent,
    AutoComplete,
    Select,
    CardsComponent
  ],
  templateUrl: './ads.component.html',
  styleUrl: './ads.component.scss'
})
export class AdsComponent {
  FilterDrawerVisible: boolean = false;
  UserOrAd: boolean = true

  ads: Ad[] = [];
  cats: Category[] = []

  // Filter properties
  priceRange: number[] = [0, 100000];
  selectedCategories: string[] = [];
  selectedConditions: string[] = [];

  // Search & sort
  query: string = '';
  selectedSort: SortBy | undefined;
  SortingCategories: SortBy[] | undefined;

  getAds() {
    this.apiService.selectByField('adverts', 'status', 'eq', 'active').subscribe(adverts => {
      this.ads = adverts as Ad[];
    });
  }
  getCategories(){
    this.apiService.selectAll('categories').subscribe(categs =>{
      this.cats = categs as Category[]
    })
  }

  getAdImage(ad: Ad): string {
    if (ad.images && ad.images.length > 0) {
      return `${environment.serverUrl}${ad.images[0].url}`;
    }
    return 'https://primefaces.org/cdn/primeng/images/card-ng.jpg';
  }

  constructor(
    private apiService: ApiService,
    private authService: AuthService
  ) { }
  ngOnInit() {
      this.SortingCategories = [
          {label:"Időrendi sorrendbe",value:0},
          {label:"Relevancia",value:1}
        ];
      this.getCategories();
      this.getAds();
  }
  
  querySelectedAdvert: Ad | 'All' = 'All';
      get filterAds(): Ad[] {
      const q = this.query.trim().toLowerCase();
      const filtered = this.ads.filter((r) => {
        const matchesQuery = !q || r.name.toLowerCase().includes(q);
        const matchesCat = this.querySelectedAdvert === 'All' || r.name === this.querySelectedAdvert.name;
        return matchesQuery && matchesCat;
      });
      return filtered;
  }

get filteredAds(): Ad[] {
    let result = [...this.ads];

    if (this.query.trim()) {
      const q = this.query.trim().toLowerCase();
      result = result.filter(ad =>
        ad.name.toLowerCase().includes(q) ||
        ad.description.toLowerCase().includes(q)
      );
    }

    if (this.selectedCategories.length > 0) {
      result = result.filter(ad =>
        this.selectedCategories.includes(ad.category_id)
      );
    }

    result = result.filter(ad =>
      ad.price >= this.priceRange[0] && ad.price <= this.priceRange[1]
    );

    if (this.selectedSort) {
      if (this.selectedSort.value === 0) {
        result.sort((a, b) => {
          const dateA = new Date(a.date_of_upload || 0).getTime();
          const dateB = new Date(b.date_of_upload || 0).getTime();
          return dateB - dateA;
        });
      } else if (this.selectedSort.value === 1) {
        result.sort((a, b) => {
          const q = this.query.toLowerCase();
          const scoreA = a.name.toLowerCase().indexOf(q);
          const scoreB = b.name.toLowerCase().indexOf(q);
          return scoreA - scoreB;
        });
      }
    }

    return result;
  }
  resetFilters() {
    this.query = '';
    this.priceRange = [0, 100000];
    this.selectedCategories = [];
    this.selectedSort = undefined;
  }
}
