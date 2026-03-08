import { Component, OnInit } from '@angular/core';
import { AccordionModule } from 'primeng/accordion';
import { ApiService } from '../../../services/api.service';
import { Ticket } from '../../../interfaces/ticket';
import { FormsModule } from '@angular/forms';
import { DividerModule } from 'primeng/divider';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-support',
  standalone: true,
  imports: [AccordionModule, FormsModule, DatePipe, DividerModule],
  templateUrl: './support.component.html',
  styleUrl: './support.component.scss'
})
export class SupportComponent implements OnInit {

  tickets: Ticket[] = [];
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

}
