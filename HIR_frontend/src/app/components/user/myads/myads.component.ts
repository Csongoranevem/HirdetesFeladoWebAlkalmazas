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
import { FormsModule } from '@angular/forms';
import { Dialog, DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { Select } from 'primeng/select';
import { Category } from '../../../interfaces/category';
import { Payment } from '../../../interfaces/payments';
import { ScrollPanelModule } from 'primeng/scrollpanel';

@Component({
  selector: 'app-myads',
  standalone: true,
  imports: [
    CardsComponent,
    TableModule,
    TagModule,
    CommonModule,
    CurrencyPipe,
    Button,
    FormsModule,
    Dialog,
    DialogModule,
    InputTextModule,
    TextareaModule,
    Select,
    ScrollPanelModule
  ],
  templateUrl: './myads.component.html',
  styleUrl: './myads.component.scss'
})
export class MyadsComponent implements OnInit{
  myAds: Ad[] = [];
  categories: Category[] = [];
  paymentMethods: Payment[] = [];

  editDialogVisible = false;
  editModel: Ad | null = null;
  saving = false;

  readonly statusOptions: Array<{ name: string; value: Ad['status'] }> = [
    { name: 'Aktív', value: 'active' },
    { name: 'Inaktív', value: 'inactive' }
  ];

  constructor(
    private api:ApiService,
    private authService: AuthService,
    private messageService: MessageService
  ){}

  ngOnInit(): void {
    this.api.selectByField('adverts', 'user_id','eq', this.authService.GetLoggedUser().id || '').subscribe((data) => {
      this.myAds = data as Ad[];
    });

    this.api.selectAll('categories').subscribe((data) => {
      this.categories = data as Category[];
    });

    this.api.selectAll('payments').subscribe((data) => {
      this.paymentMethods = data as Payment[];
    });
  }

  getAdImage(ad: Ad): string {
      if (ad.images && ad.images.length > 0) {
        return `${environment.serverUrl}${ad.images[0].url}`;
      }
      return 'https://primefaces.org/cdn/primeng/images/card-ng.jpg';
    }

    getCategoryName(categoryId: string): string {
      const category = this.categories.find(c => c.id === categoryId);
      return category ? category.name : categoryId;
    }

    getPaymentMethodName(paymentId: string): string {
      const payment = this.paymentMethods.find(p => p.id === paymentId);
      return payment ? payment.name : paymentId;
    }

    openEditAd(ad: Ad): void {
      if (!ad.id) {
        this.messageService.add({
          severity: 'error',
          summary: 'Hiba',
          detail: 'A hirdetés azonosítója hiányzik, nem szerkeszthető.',
          key: 'br'
        });
        return;
      }

      this.editModel = {
        ...ad,
        images: ad.images ? [...ad.images] : []
      } as Ad;
      this.editDialogVisible = true;
    }

    cancelEdit(): void {
      this.editDialogVisible = false;
      this.editModel = null;
      this.saving = false;
    }

    private buildUpdatePayload(ad: Ad): object {
      return {
        user_id: ad.user_id,
        name: ad.name,
        description: ad.description,
        price: ad.price,
        city_id: ad.city_id,
        product_id: ad.product_id,
        payment_method: ad.payment_method,
        category_id: ad.category_id,
  condition_id: ad.condition_id,
        status: ad.status
      };
    }

    saveEdit(): void {
      if (!this.editModel?.id) return;

      const errors: string[] = [];
      if (!this.editModel.name || this.editModel.name.trim() === '') errors.push('A termék neve kötelező!');
      if (!this.editModel.price || this.editModel.price <= 0) errors.push('Az irányár megadása kötelező!');
      if (!this.editModel.category_id) errors.push('Kérjük válasszon kategóriát!');
      if (!this.editModel.payment_method) errors.push('Kérjük válasszon fizetési módot!');
      if (!this.editModel.description || this.editModel.description.trim() === '') errors.push('A leírás megadása kötelező!');

      if (errors.length > 0) {
        errors.forEach(error => {
          this.messageService.add({
            severity: 'error',
            summary: 'Hiányzó adat',
            detail: error,
            life: 4000,
            key: 'br'
          });
        });
        return;
      }

      this.saving = true;
      const id = this.editModel.id;
      const payload = this.buildUpdatePayload(this.editModel);

      this.api.update('adverts', id, payload).subscribe({
        next: (updated: any) => {
          const updatedAd = (updated && typeof updated === 'object' && !Array.isArray(updated))
            ? (updated as Ad)
            : this.editModel!;

          this.myAds = this.myAds.map(a => (a.id === id ? { ...a, ...updatedAd } : a));
          this.messageService.add({
            severity: 'success',
            summary: 'Sikeres módosítás',
            detail: 'A hirdetés sikeresen módosítva lett.',
            key: 'br'
          });
          this.cancelEdit();
        },
        error: () => {
          this.saving = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Hiba',
            detail: 'Nem sikerült a hirdetés mentése. Próbáld újra!',
            key: 'br'
          });
        }
      });
    }
    
    deleteAd(id:string): void {
        this.api.delete('adverts', id).subscribe(() => {
          this.myAds = this.myAds.filter(a => a.id !== id);
        });
    }
  }