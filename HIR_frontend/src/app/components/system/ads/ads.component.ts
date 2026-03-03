import { Component } from '@angular/core';
import { DrawerModule } from 'primeng/drawer';
import { Button, ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DividerModule } from 'primeng/divider';
import { FormsModule } from '@angular/forms';
import { Slider } from 'primeng/slider';
import { AccordionModule } from 'primeng/accordion';
import { Checkbox } from 'primeng/checkbox';
import { ToggleSwitchModule } from 'primeng/toggleswitch';

@Component({
  selector: 'app-ads',
  standalone: true,
  imports: [
    CommonModule,
    DrawerModule,
    RouterModule,
    Button,
    ButtonModule,
    DividerModule,
    FormsModule,
    Slider,
    AccordionModule,
    Checkbox,
    ToggleSwitchModule
  ],
  templateUrl: './ads.component.html',
  styleUrl: './ads.component.scss'
})
export class AdsComponent {
  FilterDrawerVisible: boolean = false;
  UserOrAd: boolean = false
}
