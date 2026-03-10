import { Component, OnInit } from '@angular/core';
import { AccordionModule } from 'primeng/accordion';
import { ApiService } from '../../../services/api.service';
import { Ticket } from '../../../interfaces/ticket';
import { FormsModule } from '@angular/forms';
import { DividerModule } from 'primeng/divider';
import { DatePipe } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TextareaModule } from 'primeng/textarea';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-support',
  standalone: true,
  imports: [AccordionModule, FormsModule, DatePipe, DividerModule, CardModule, TextareaModule, ButtonModule],
  templateUrl: './support.component.html',
  styleUrl: './support.component.scss'
})
export class SupportComponent implements OnInit {

  tickets: Ticket[] = [];
  emailContent: string = '';
  emailSubject: string = '';
  email: string = '';
  constructor(
    private api: ApiService
  ) { }

  ngOnInit(): void {
    this.getTickets();
  }

  getTickets(): void {
    this.api.selectAll('support').subscribe({
      next: (res) => {
        this.tickets = res as Ticket[];
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  sendEmail(): void {
    const emailData = {
      to: this.email,
      subject: this.emailSubject,
      content: this.emailContent
    };

    // API hívás itt lesz
  }

}
