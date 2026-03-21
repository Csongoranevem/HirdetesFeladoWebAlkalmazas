import { Routes } from '@angular/router';
import { PagenotfoundComponent } from './components/system/pagenotfound/pagenotfound.component';
import { HomeComponent } from './components/system/home/home.component';
import { RegistrationComponent } from './components/user/registration/registration.component';
import { LoginComponent } from './components/user/login/login.component';
import { LogoutComponent } from './components/user/logout/logout.component';
import { CardsComponent } from './components/system/cards/cards.component';
import { NewadvertComponent } from './components/user/newadvert/newadvert.component';
import { AdsComponent } from './components/system/ads/ads.component';
import { SupportComponent } from './components/system/support/support.component';
import { MyadsComponent } from './components/user/myads/myads.component';
import { SingleAdvertComponent } from './components/system/single-advert/single-advert.component';

export const routes: Routes = [
    {path: 'home', component:HomeComponent},
    {path: 'ads', component: AdsComponent},
    {path:'registration', component:RegistrationComponent},
    {path:'login',component:LoginComponent},
    {path:'logout', component:LogoutComponent},
    { path: 'support', component: SupportComponent},
    {path: '', redirectTo: 'home', pathMatch: 'full'},
    {path:'myads', component:MyadsComponent},
    {path:'newAdvert',component:NewadvertComponent},
    { path: 'singleAdvert/:id', component: SingleAdvertComponent },

    //This route must be in the last line
    {path: '**',component:PagenotfoundComponent},
];
