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
import { Fluid } from 'primeng/fluid';
import { FloatLabel } from 'primeng/floatlabel';
import { MenuItemContent, MenuModule } from 'primeng/menu';
import { InputGroup } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { AutoComplete } from 'primeng/autocomplete';
import { Select } from 'primeng/select';
import { CardsComponent } from '../cards/cards.component';

interface SortBy {
  label: string;
  value: number;
}

@Component({
  selector: 'app-ads',
  standalone: true,
  imports: [
    CommonModule,
    DrawerModule,
    RouterModule,
    Button,
    InputGroup,
    InputGroupAddonModule,
    ButtonModule,
    DividerModule,
    FormsModule,
    Slider,
    AccordionModule,
    Checkbox,
    ToggleSwitchModule,
    Fluid,
    InputTextModule,
    FloatLabel,
    MenuModule,
    MenuItemContent,
    AutoComplete,
    Select,
    CardsComponent
  ],
  templateUrl: './ads.component.html',
  styleUrl: './ads.component.scss'
})
export class AdsComponent {
  FilterDrawerVisible: boolean = false;
  UserOrAd: boolean = false

  SortingCategories: SortBy[] | undefined;

  selectedSort: SortBy | undefined;

  ngOnInit() {
      this.SortingCategories = [
          {label:"Időrendi sorrendbe",value:0},
          {label:"Relevancia",value:1}
        ];
  }
}
