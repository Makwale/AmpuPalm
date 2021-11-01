import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomePage } from '../home/home.page';
import { SigninPage } from '../signin/signin.page';
import { SignupPage } from '../signup/signup.page';

import { MenuPage } from './menu.page';

const routes: Routes = [
  {
    path: '',
    component: MenuPage,
    children: [
      {
        path: '',
        redirectTo: 'home'
      },
      {
        path: 'home',
        loadChildren: () => import('../../pages/home/home.module').then( m => m.HomePageModule)
        
      },
      {
        path: 'signin',
        loadChildren: () => import('../../pages/signin/signin.module').then( m => m.SigninPageModule)
      },
      {
        path: 'signup',
        loadChildren: () => import('../../pages/signup/signup.module').then( m => m.SignupPageModule)
      },
      {
        path: 'bookings',
        loadChildren: () => import('../../pages/bookings/bookings.module').then( m => m.BookingsPageModule)
      },
      {
        path: 'map',
        loadChildren: () => import('../../pages/map/map.module').then( m => m.MapPageModule)
      },
      {
        path: 'account',
        loadChildren: () => import('../../pages/account/account.module').then( m => m.AccountPageModule)
      },
      
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MenuPageRoutingModule {}
