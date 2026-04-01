import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent{

  currentYear: number = new Date().getFullYear();

      constructor(
        private messageService: MessageService,
      ) {}


      phoneMessage() {
        this.messageService.add({ severity: 'info', summary: 'Telefonszámunk', detail: '+36 30 306 9977' });
      }
      emailMessage() {
        this.messageService.add({ severity: 'info', summary: 'Email címünk', detail: 'info@wanted.com' });
      }
}
