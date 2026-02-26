import { Routes } from '@angular/router';
import { PagenotfoundComponent } from './components/system/pagenotfound/pagenotfound.component';
import { HomeComponent } from './components/system/home/home.component';
import { RegistrationComponent } from './components/user/registration/registration.component';
import { LoginComponent } from './components/user/login/login.component';
import { LogoutComponent } from './components/user/logout/logout.component';
import { CardsComponent } from './components/system/cards/cards.component';
import { NewadvertComponent } from './components/user/newadvert/newadvert.component';

export const routes: Routes = [
    {path: 'home', component:HomeComponent},
    {path: 'ads', component: CardsComponent},
    {path:'registration', component:RegistrationComponent},
    {path:'login',component:LoginComponent},
    {path:'logout', component:LogoutComponent},
    {path: '', redirectTo: 'home', pathMatch: 'full'},

    {path:'newAdvert',component:NewadvertComponent},

    //This route must be in the last line
    {path: '**',component:PagenotfoundComponent},
];
