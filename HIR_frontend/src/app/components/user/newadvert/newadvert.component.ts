import { Component, OnInit } from '@angular/core';
import { Stepper, StepperModule } from 'primeng/stepper';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';


@Component({
  selector: 'app-newadvert',
  standalone: true,
  imports: [StepperModule,ButtonModule,FormsModule, InputGroupModule, InputGroupAddonModule, InputTextModule],
  templateUrl: './newadvert.component.html',
  styleUrl: './newadvert.component.scss'
})
export class NewadvertComponent{

}
