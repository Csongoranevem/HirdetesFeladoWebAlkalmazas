import { Component, OnInit } from '@angular/core';
import { Stepper, StepperModule } from 'primeng/stepper';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import{Select} from 'primeng/select';
import { IftaLabelModule } from 'primeng/iftalabel';
import { ToastModule } from 'primeng/toast';
import { FileUpload } from 'primeng/fileupload';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import { PanelModule } from 'primeng/panel';
import { ApiService } from '../../../services/api.service';
import { Category } from '../../../interfaces/category';
import { Payment } from '../../../interfaces/payments';
import { Ad } from '../../../interfaces/ad';
import { AuthService } from '../../../services/auth.service';

  interface UploadEvent {
    originalEvent: Event;
    files: File[];
}

@Component({
  selector: 'app-newadvert',
  standalone: true,
  imports: [
    StepperModule,
    ButtonModule,
    FormsModule, 
    InputGroupModule, 
    InputGroupAddonModule, 
    InputTextModule,
    Select,
    IftaLabelModule,
    FormsModule,
    FileUpload, 
    ToastModule, 
    ButtonModule,
    CommonModule,
    PanelModule

  ],
  providers: [MessageService],
  templateUrl: './newadvert.component.html',
  styleUrl: './newadvert.component.scss'
})


export class NewadvertComponent implements OnInit {

  
    constructor(
      private messageService: MessageService,
      private api: ApiService,
      private auth:AuthService
    ) {}

  uploadedFiles: any[] = [];
  categories: Category[] = [];
  paymentMethods: Payment[] = [];
  newAdvert:Ad = {
    user_id: sessionStorage.getItem('id') || '',
    name: '',
    description: '',
    price: 0,
    city_id: 'Söréd',
    product_id: 'TElefon',
    payment_method: '',
    category_id: '',
    status: 'active'
  };



    ngOnInit(): void {
      this.api.selectAll('categories').subscribe((data)=>{
        this.categories=data as Category[];
      });

      this.api.selectAll('payments').subscribe((data)=>{
        this.paymentMethods=data as Payment[];
      });
    }

    onUpload(event:UploadEvent) {
        for(let file of event.files) {
            this.uploadedFiles.push(file);
        }

        this.messageService.add({severity: 'info', summary: 'File Uploaded', detail: ''});
    }

    getCategoryName(categoryId: string): string {
      const category = this.categories.find(c => c.id === categoryId);
      return category ? category.name : 'Nincs kiválasztva';
    }

    getPaymentMethodName(paymentId: string): string {
      const payment = this.paymentMethods.find(p => p.id === paymentId);
      return payment ? payment.name : 'Nincs kiválasztva';
    }

    postAdvert() {
      const errors: string[] = [];

      if (!this.newAdvert.name || this.newAdvert.name.trim() === '') {
        errors.push('A termék neve kötelező!');
      }
      if (!this.newAdvert.price || this.newAdvert.price <= 0) {
        errors.push('Az irányár megadása kötelező!');
      }
      if (!this.newAdvert.category_id) {
        errors.push('Kérjük válasszon kategóriát!');
      }
      if (!this.newAdvert.payment_method) {
        errors.push('Kérjük válasszon fizetési módot!');
      }
      if (!this.newAdvert.description || this.newAdvert.description.trim() === '') {
        errors.push('A leírás megadása kötelező!');
      }

      if (errors.length > 0) {
        errors.forEach(error => {
          this.messageService.add({
            severity: 'error',
            summary: 'Hiányzó adat',
            detail: error,
            life: 4000
          });
        });
        return;
      }

      this.api.insert('adverts', this.newAdvert).subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Siker!',
            detail: 'A hírdetés sikeresen feladva!',
            life: 4000
          });
          
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Hiba',
            detail: 'Hiba történt a hírdetés feladása során. Kérjük próbálja újra!',
            life: 4000
          });
        }
      });
    }

}
