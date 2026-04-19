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
import { InputText } from 'primeng/inputtext';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-support',
  standalone: true,
  imports: [AccordionModule, FormsModule, DatePipe, DividerModule, CardModule, TextareaModule, ButtonModule, InputText],
  templateUrl: './support.component.html',
  styleUrl: './support.component.scss'
})
export class SupportComponent implements OnInit {

  tickets: Ticket[] = [];
  emailContent: string = '';
  emailSubject: string = '';
  email: string = '';
  sending: boolean = false;
  constructor(
    private api: ApiService,
    private messageService: MessageService
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
    const email = this.email.trim();
    const subject = this.emailSubject.trim();
    const message = this.emailContent.trim();

    if (!email || !subject || !message) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Hiányzó adat',
        detail: 'Email, tárgy és üzenet kitöltése kötelező.',
        key: 'br'
      });
      return;
    }

    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailOk) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Hibás email',
        detail: 'Kérlek adj meg egy érvényes email címet.',
        key: 'br'
      });
      return;
    }

    if (this.sending) return;
    this.sending = true;

    this.api.supportContact(email, subject, message).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Elküldve',
          detail: 'Az üzenetedet megkaptuk, hamarosan válaszolunk.',
          key: 'br'
        });
        this.email = '';
        this.emailSubject = '';
        this.emailContent = '';
        this.sending = false;
      },
      error: (err) => {
        console.error(err);
        const detail = err?.error?.message || 'Nem sikerült elküldeni az üzenetet.';
        this.messageService.add({
          severity: 'error',
          summary: 'Hiba',
          detail,
          key: 'br'
        });
        this.sending = false;
      }
    });
  }

}
