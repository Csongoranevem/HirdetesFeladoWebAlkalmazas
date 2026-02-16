import { Routes } from '@angular/router';
import { PagenotfoundComponent } from './components/system/pagenotfound/pagenotfound.component';

export const routes: Routes = [

    
    
    //This route must be in the last line
    {path: '**',component:PagenotfoundComponent}
    
];
