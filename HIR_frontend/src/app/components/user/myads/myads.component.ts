import { Component, OnInit } from '@angular/core';
import { CardsComponent } from '../../system/cards/cards.component';
import { Ad } from '../../../interfaces/ad';
import { ApiService } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';
import { environment } from '../../../../environments/environment.development';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { CommonModule } from '@angular/common';
import { CurrencyPipe } from '@angular/common';
import { Button } from 'primeng/button';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-myads',
  standalone: true,
  imports: [CardsComponent, TableModule, TagModule, CommonModule, CurrencyPipe, Button],
  templateUrl: './myads.component.html',
  styleUrl: './myads.component.scss'
})
export class MyadsComponent implements OnInit{
  myAds: Ad[] = [];
  categories: string[] = [];
  selectedAd: Ad | null = null;

  constructor(
    private api:ApiService,
    private authService: AuthService,
    private messageService: MessageService
  ){}

  ngOnInit(): void {
    this.api.selectByField('adverts', 'user_id','eq', this.authService.GetLoggedUser().id || '').subscribe((data) => {
      this.myAds = data as Ad[];
      console.log(this.myAds);
    });

    this.api.selectAll('categories').subscribe((data) => {
      this.categories = data as string[];
    });
  }

  getAdImage(ad: Ad): string {
      if (ad.images && ad.images.length > 0) {
        return `${environment.serverUrl}${ad.images[0].url}`;
      }
      return 'https://primefaces.org/cdn/primeng/images/card-ng.jpg';
    }


    editAd(id:string): void {

      this.selectedAd = this.myAds.find(ad => ad.id === id) || null;
      this.api.update('adverts', id, this.selectedAd || {}).subscribe((updatedAd) => {
        this.messageService.add({severity:'success', summary:'Sikeres módosítás', detail:'A hirdetés sikeresen módosítva lett.'});
      });
    }
    
    deleteAd(id:string): void {
        this.api.delete('adverts', id).subscribe(() => {
          this.myAds = this.myAds.filter(a => a.id !== id);
        });
    }
  }