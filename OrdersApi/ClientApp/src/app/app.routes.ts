import { Routes } from '@angular/router';
import { HomeComponentComponent } from './components/home-component/home-component.component';
import { LandingComponent } from './components/landing/landing.component';
import { OpenOrdersComponent } from './components/open-orders/open-orders.component';
import { OrderDetailComponent } from './components/order-detail/order-detail.component';
import { FileBrowserComponent } from './components/file-browser/file-browser.component';

export const routes: Routes = [
    {path:'', component:LandingComponent}
  ,{path:'scanner', component:HomeComponentComponent}
  ,{path:'openorders',component:OpenOrdersComponent}
  ,{path:'orderdetail', component:OrderDetailComponent},{path:'browser', component:FileBrowserComponent},
  { path: '**', redirectTo: '' }];
