import { Routes } from '@angular/router';
import { PagenotfoundComponent } from './components/system/pagenotfound/pagenotfound.component';
import { HomeComponent } from './components/system/home/home.component';
import { RegistrationComponent } from './components/user/registration/registration.component';

export const routes: Routes = [
    {path: 'home', component:HomeComponent},
    {path:'registration', component:RegistrationComponent},
    {path: '', redirectTo: 'home', pathMatch: 'full'},
    //This route must be in the last line
    {path: '**',component:PagenotfoundComponent},
];
