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
import { User } from '../../../interfaces/user';
import { ActivatedRoute } from '@angular/router';
import { PaginatorModule } from 'primeng/paginator';
import { Condition } from '../../../interfaces/condition';
import { Dialog } from 'primeng/dialog';
import { ScrollPanel, ScrollPanelModule } from 'primeng/scrollpanel';
import { Password } from 'primeng/password';
import { IftaLabelModule } from 'primeng/iftalabel';

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
    PaginatorModule,
    CardsComponent,
    Dialog,
    ScrollPanel,
    IftaLabelModule
  ],
  templateUrl: './ads.component.html',
  styleUrl: './ads.component.scss'
})
export class AdsComponent {



  FilterDrawerVisible: boolean = false;
  UserOrAd: boolean = false

  ads: Ad[] = [];
  users: User[] = [];
  cats: Category[] = []

  // Filter properties
  maxAdPrice: number = 0

  priceRange: number[] = [0, this.maxAdPrice];
  selectedCategories: string[] = [];
  selectedConditions: string[] = [];
  conditions: Condition[] = [];
  comments: Comment[] = [];

  // Search & sort
  query: string = '';
  selectedSort: SortBy | undefined;
  SortingCategories: SortBy[] | undefined;

  // Pagination
  pageSize = 8;
  first = 0;

  getAds() {
    this.apiService.selectByField('adverts', 'status', 'eq', 'active').subscribe(adverts => {
      this.ads = adverts as Ad[];
      this.maxAdPrice = this.ads.reduce((max, ad) => ad.price > max ? ad.price : max, 0);
      this.priceRange = [0, this.maxAdPrice];
    });
  }

  getCategories() {
    this.apiService.selectAll('categories').subscribe(categs => {
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
  private authService: AuthService,
  private route: ActivatedRoute
  ) { }
  ngOnInit() {
    this.SortingCategories = [
      { label: "Legújabbak", value: 0 },
      { label: "Értékelések alapján", value: 1},
      { label: "Ár szerint növekvő", value: 2 },
      { label: "Ár szerint csökkenő", value: 3 },
      { label: "Név szerint A-Z", value: 4},
      { label: "Név szerint Z-A", value: 5},
    ];
    this.apiService.selectAll('comments').subscribe(comments => {
      this.comments = comments as Comment[];
    });
    this.getCategories();
    this.getAds();
    this.getUsers();
    this.getConditions();

    // Ha a főoldalról kategória-szűrővel érkezünk (pl. /ads?category=3),
    // akkor ezt előre beállítjuk a szűrőben.
    this.route.queryParamMap.subscribe(params => {
      const categoryId = params.get('category');
      if (categoryId) {
        this.selectedCategories = [categoryId];
        this.UserOrAd = false;
  this.first = 0;
      }
    });
  }


  querySelectedAdvert: Ad | 'All' = 'All';
  querySelectedUser: User | 'All' = 'All';



  getConditions() {
    this.apiService.selectAll('conditions').subscribe(conds => {
      this.conditions = conds as Condition[]
      console.log(this.conditions)
  })}

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

    if (this.selectedConditions.length > 0) {
      const selectedConditionIds = this.conditions
        .filter(condition => this.selectedConditions.includes(condition.name))
        .map(condition => condition.id);
  
      result = result.filter(ad =>
        selectedConditionIds.includes(ad.condition_id)
      );
    }
    if (this.selectedSort) {
      switch (this.selectedSort.value) {
        case 0: // Sort by date (newest first)
          result.sort((a, b) => {
            const dateA = new Date(a.createdAt || 0).getTime();
            const dateB = new Date(b.createdAt || 0).getTime();
            return dateB - dateA;
          });
          break;
  
        case 1: // Sort by rating (highest first)
          result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
          break;
  
        case 2: // Sort by price (ascending)
          result.sort((a, b) => a.price - b.price);
          break;
  
        case 3: // Sort by price (descending)
          result.sort((a, b) => b.price - a.price);
          break;
  
        case 4: // Sort by name (A-Z)
          result.sort((a, b) => a.name.localeCompare(b.name));
          break;
  
        case 5: // Sort by name (Z-A)
          result.sort((a, b) => b.name.localeCompare(a.name));
          break;
      }
    }

    return result;
  }

  get pagedAds(): Ad[] {
    return this.filteredAds.slice(this.first, this.first + this.pageSize);
  }

  onPageChange(event: any) {
    this.first = event.first ?? 0;
    this.pageSize = event.rows ?? this.pageSize;
  }
  resetFilters() {
    this.query = '';
    this.priceRange = [0, 100000];
    this.selectedCategories = [];
    this.selectedSort = undefined;
    this.first = 0;
  }



  getUsers() {
    this.apiService.selectByField('users', 'status', 'eq', '1').subscribe(users => {
      this.users = users as User[];
    });
  }

  get filterUsers() {
    const q = this.query.trim().toLowerCase();
    const filtered = this.users.filter((r) => {
      const matchesQuery = !q || r.name.toLowerCase().includes(q);
      const matchesCat = this.querySelectedUser === 'All' || r.name === this.querySelectedUser.name;
      return matchesQuery && matchesCat;
    });
    return filtered;
  }

  get filteredUsers() {
    let result = [...this.users];

    if (this.query.trim()) {
      const q = this.query.trim().toLowerCase();
      result = result.filter(user =>
        user.name.toLowerCase().includes(q) ||
        user.email.toLowerCase().includes(q)
      );
    }

    return result;
  }


    /// Open user's profile
    viewProfileDialog: boolean = false;
    selectedUserView: User | null = null;
    
    viewUserProfile(userId: string) {
      this.selectedUserView = this.users.find(u => u.id === userId) || null;
      this.viewProfileDialog = true;
    }

    get userAds(): Ad[] {
      if (!this.selectedUserView) {
        return [];
      }
      return this.ads.filter(ad => ad.user_id === this.selectedUserView!.id);
    }
}
