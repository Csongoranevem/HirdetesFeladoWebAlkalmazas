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


  uploadedFiles: any[] = [];
  categories: Category[] = [];


    constructor(
      private messageService: MessageService,
      private api: ApiService
    ) {}

    ngOnInit(): void {
      this.api.selectAll('categories').subscribe((data)=>{
        this.categories=data as Category[];
      });
    }

    onUpload(event:UploadEvent) {
        for(let file of event.files) {
            this.uploadedFiles.push(file);
        }

        this.messageService.add({severity: 'info', summary: 'File Uploaded', detail: ''});
    }
  

    


}
