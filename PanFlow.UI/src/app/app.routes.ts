// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { Register } from './features/auth/components/register/register';
import { Login } from './features/auth/components/login/login';
import { DashboardLayout } from './features/dashboard/components/dashboard-layout/dashboard-layout';
import { Dashboard } from './features/dashboard/components/dashboard/dashboard';
import { Aspects } from './features/aspects/components/aspects/aspects';
import { Habits } from './features/habits/components/habits/habits';
import { Day } from './features/day/components/day/day';

export const routes: Routes = [
  { path: 'register', component: Register },
  { path: 'login', component: Login },
  
  // دمجنا الـ Dashboard والـ Aspects كأبناء للـ Layout المحمي بالـ Guard
  { 
    path: '', 
    component: DashboardLayout, 
    canActivate: [authGuard],
    children: [
      { path: '', component: Dashboard },
      { path: 'aspects', component: Aspects },
      {path:'habits' , component: Habits},
      {path: 'days' , component: Day}
    ]
  },
];