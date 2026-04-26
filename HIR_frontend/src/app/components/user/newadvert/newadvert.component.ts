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
import { forkJoin } from 'rxjs';
import { Router } from '@angular/router';
import { TextareaModule } from 'primeng/textarea';
import { FloatLabel } from 'primeng/floatlabel';
import { Condition } from '../../../interfaces/condition';

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
    PanelModule,
    TextareaModule,
    FloatLabel

  ],
  providers: [MessageService],
  templateUrl: './newadvert.component.html',
  styleUrl: './newadvert.component.scss'
})


export class NewadvertComponent implements OnInit {

  
    constructor(
      private messageService: MessageService,
      private api: ApiService,
      private auth:AuthService,
      private router: Router
    ) {}

  uploadedFiles: any[] = [];
  selectedFiles: File[] = [];
  isSubmitting = false;
  categories: Category[] = [];
  paymentMethods: Payment[] = [];
  conditions: Condition[] = [];
  newAdvert:Ad = {
    user_id: '',  // This will be set dynamically when posting the advert
    name: '',
    description: '',
    price: 0,
    city_id: 'Söréd',
    product_id: 'TElefon',
    payment_method: '',
    category_id: '',
    condition_id: '',
    status: 'active'
  };

  



    ngOnInit(): void {
      this.api.selectAll('categories').subscribe((data)=>{
        this.categories=data as Category[];
      });

      this.api.selectAll('payments').subscribe((data)=>{
        this.paymentMethods=data as Payment[];
      });

      this.api.selectAll('conditions').subscribe((data)=>{
        this.conditions=data as Condition[];
      });
    }

    onSelectFiles(event: any) {
        for (let file of event.files) {
            this.selectedFiles.push(file);
        }
    }

    onRemoveFile(event: any) {
        const index = this.selectedFiles.indexOf(event.file);
        if (index > -1) {
            this.selectedFiles.splice(index, 1);
        }
    }

    onClearFiles() {
        this.selectedFiles = [];
    }

    getCategoryName(categoryId: string): string {
      const category = this.categories.find(c => c.id === categoryId);
      return category ? category.name : 'Nincs kiválasztva';
    }

    getConditionName(conditionId: string): string {
      const condition = this.conditions.find(c => c.id === conditionId);
      return condition ? condition.name : 'Nincs kiválasztva';
    }

    getPaymentMethodName(paymentId: string): string {
      const payment = this.paymentMethods.find(p => p.id === paymentId);
      return payment ? payment.name : 'Nincs kiválasztva';
    }

    private resetFormState(): void {
      this.newAdvert = {
        user_id: this.auth.GetLoggedUser().id,
        name: '',
        description: '',
        price: 0,
        city_id: this.newAdvert.city_id,
        product_id: this.newAdvert.product_id,
        payment_method: '',
        category_id: '',
  condition_id: '',
        status: 'active'
      };
      this.selectedFiles = [];
      this.uploadedFiles = [];
    }

    postAdvert() {
      if (this.isSubmitting) {
        return;
      }
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
      if (!this.newAdvert.condition_id) {
        errors.push('Kérjük válassza ki a termék állapotát!');
      }
      if (!this.newAdvert.payment_method) {
        errors.push('Kérjük válasszon fizetési módot!');
      }
      if (!this.newAdvert.description || this.newAdvert.description.trim() === '') {
        errors.push('A leírás megadása kötelező!');
      }

      if (errors.length > 0) {
        if (errors.length === 1) {
          this.messageService.add({
            severity: 'error',
            summary: 'Hiányzó adat',
            detail: errors[0],
            life: 4000
          });
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Hiányzó adatok',
            detail: 'Kérjük töltse ki az összes mezőt!',
            life: 4000
          });
        }
        return;
      }

      // Get the user ID from the stored token
      const loggedUser = this.auth.GetLoggedUser();
      if (!loggedUser || !loggedUser.id) {
        this.messageService.add({
          severity: 'error',
          summary: 'Hiba',
          detail: 'Nem vagy bejelentkezve! Kérjük jelentkezz be.',
          life: 4000
        });
        return;
      }

      // Set the user_id from the token
      this.newAdvert.user_id = loggedUser.id;

  this.isSubmitting = true;

      this.api.insert('adverts', this.newAdvert).subscribe({
        next: (response: any) => {
          const advertId = response.id;

          // Upload images if any were selected
          if (this.selectedFiles.length > 0) {
            const uploadObservables = this.selectedFiles.map(file =>
              this.api.uploadImage(advertId, file)
            );

            forkJoin(uploadObservables).subscribe({
              next: () => {
                this.messageService.add({
                  severity: 'success',
                  summary: 'Siker!',
                  detail: 'A hirdetés és a képek sikeresen feltöltve!',
                  life: 4000
                });
                this.resetFormState();
                this.isSubmitting = false;
                setTimeout(() => {
                  this.router.navigateByUrl('home');
                }, 500);
              },
              error: (error) => {
                this.messageService.add({
                  severity: 'warn',
                  summary: 'Részleges siker',
                  detail: 'A hirdetés feladva, de a képek feltöltése sikertelen.',
                  life: 4000
                });
                this.resetFormState();
                this.isSubmitting = false;
                setTimeout(() => {
                  this.router.navigateByUrl('home');
                }, 500);
              }
            });
          } else {
            this.messageService.add({
              severity: 'success',
              summary: 'Siker!',
              detail: 'A hirdetés sikeresen feladva!',
              life: 4000
            });
            this.resetFormState();
            this.isSubmitting = false;
            setTimeout(() => {
              this.router.navigateByUrl('home');
            }, 1000);

          }
          
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Hiba',
            detail: 'Hiba történt a hirdetés feladása során. Kérjük próbálja újra!',
            life: 4000
          });
          this.isSubmitting = false;
        }
      });
    }

}
